# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException, UploadFile, File, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
from typing import Optional, List, Set
import PyPDF2
import io
import asyncio
import json
import logging
import time
import uuid

# LangChain / LangGraph
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain_community.vectorstores import Qdrant
from qdrant_client import QdrantClient
from langgraph.graph import END, StateGraph
from typing import TypedDict, Dict, Any
from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("api")

# Load environment variables from a .env file if present
load_dotenv()
logger.info("Environment variables loaded")

logger.info("QDRANT_URL: %s", os.getenv("QDRANT_URL"))

# Initialize FastAPI application with a title
app = FastAPI(title="OpenAI Chat API")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=False,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)


@app.middleware("http")
async def add_request_id_and_log(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start = time.time()
    # Attach to state for downstream use
    request.state.request_id = request_id
    logger.info(
        "request_start method=%s path=%s request_id=%s",
        request.method,
        request.url.path,
        request_id,
    )
    try:
        response = await call_next(request)
        duration_ms = int((time.time() - start) * 1000)
        logger.info(
            "request_end status=%s duration_ms=%s request_id=%s",
            getattr(response, "status_code", "n/a"),
            duration_ms,
            request_id,
        )
        return response
    except Exception as e:
        duration_ms = int((time.time() - start) * 1000)
        logger.exception(
            "request_error duration_ms=%s request_id=%s error=%s",
            duration_ms,
            request_id,
            str(e),
        )
        raise

# App state for vector store and topics
app.state.topics_set = set()
app.state.qa_store = None  # Qdrant-backed LangChain vector store for agent

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    user_message: str      # Message from the user
    model: Optional[str] = "gpt-4.1-mini"  # Optional model selection with default
    api_key: str          # OpenAI API key for authentication
    history: Optional[List[ChatMessage]] = None  # Prior conversation turns


class TopicQuestionRequest(BaseModel):
    topic: str
    api_key: str
    num_choices: int = 4
    model: Optional[str] = "gpt-4.1-mini"
    # Controls for diversification
    seed: Optional[int] = None
    diversity: float = 0.5  # 0..1 influences randomness and variation
    num_contexts: int = 4   # how many retrieved chunks to feed generator
    query_fanout: int = 5   # how many expanded queries to use
    variation_id: Optional[int] = None  # influences scenario style/phrasing

def extract_text_from_pdf(pdf_file: bytes) -> List[str]:
    """Extract text from PDF and split it into chunks."""
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file))
    chunks = []
    
    for page in pdf_reader.pages:
        text = page.extract_text()
        # Split text into smaller chunks (simple approach - split by paragraphs)
        paragraphs = text.split('\n\n')
        chunks.extend([p.strip() for p in paragraphs if p.strip()])
    
    return chunks


def _extract_topics_sync(chunk_text: str, client: OpenAI) -> List[str]:
    """Blocking helper that calls OpenAI to extract topics for a single chunk.

    Returns a list of concise topic labels (strings). Falls back to an empty list
    if the model output cannot be parsed as JSON.
    """
    system_msg = (
        "You extract concise topic labels from provided text. "
        "Return ONLY a JSON array of 1-5 short noun-phrase topics."
    )
    user_msg = (
        "Text chunk:\n" + chunk_text[:6000]
    )
    resp = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ],
        temperature=0,
    )
    content = resp.choices[0].message.content if resp.choices else "[]"
    try:
        parsed = json.loads(content)
        if isinstance(parsed, list):
            # Normalize topics: strip, lowercase, and remove empties
            return [t.strip() for t in parsed if isinstance(t, str) and t.strip()]
    except Exception:
        pass
    return []


async def extract_topics_for_chunks(chunks: List[str], client: OpenAI, concurrency_limit: int = 5) -> List[str]:
    """Extract topics for each chunk concurrently with a semaphore limit.

    Aggregates topics into a unique, sorted list.
    """
    semaphore = asyncio.Semaphore(concurrency_limit)

    async def run_for_chunk(chunk: str) -> List[str]:
        async with semaphore:
            return await asyncio.to_thread(_extract_topics_sync, chunk, client)

    tasks = [run_for_chunk(chunk) for chunk in chunks]
    all_results = await asyncio.gather(*tasks)

    unique_topics: Set[str] = set()
    for topic_list in all_results:
        for topic in topic_list:
            normalized = topic.strip()
            if normalized:
                unique_topics.add(normalized)

    return sorted(unique_topics)


# ---------- LangGraph agent for topic-based MCQ generation ----------

class AgentState(TypedDict):
    topic: str
    queries: List[str]
    retrieved: List[Dict[str, Any]]
    question: Dict[str, Any]
    seed: Optional[int]
    diversity: float
    num_contexts: int
    query_fanout: int
    variation_id: Optional[int]


def retrieve_node(state: AgentState) -> AgentState:
    """Retrieve relevant documents using expanded queries with MMR for diversity.

    - If `queries` are provided in state, issue retrieval for each query and merge results.
    - Otherwise, fall back to retrieving using the original `topic` only.
    - Deduplicate by page content to reduce repetition.
    """
    topic = state["topic"]
    queries = state.get("queries") or []
    query_fanout = max(1, int(state.get("query_fanout") or 5))
    seed = state.get("seed")
    if app.state.qa_store is None:
        return {**state, "retrieved": []}

    diversity = float(state.get("diversity") or 0.5)
    k = 6 if diversity < 0.5 else 8
    fetch_k = 24 if diversity < 0.5 else 36
    lambda_mult = 0.6 + 0.3 * min(1.0, max(0.0, diversity))
    retriever = app.state.qa_store.as_retriever(
        search_type="mmr",
        search_kwargs={"k": k, "fetch_k": fetch_k, "lambda_mult": lambda_mult},
    )

    all_docs: List[Any] = []
    if queries:
        # Use a seeded RNG to select a subset of queries for diversity
        try:
            import random
            rng = random.Random(seed)
            selected_queries = queries[:]
            rng.shuffle(selected_queries)
            selected_queries = selected_queries[: min(query_fanout, len(selected_queries))]
        except Exception:
            selected_queries = queries[: min(query_fanout, len(queries))]

        # Log the selected queries used for retrieval
        try:
            logger.info(
                "research_selected_queries seed=%s selected=%s",
                seed,
                selected_queries,
            )
        except Exception:
            pass

        for q in selected_queries:
            try:
                q_docs = retriever.get_relevant_documents(q)
                all_docs.extend(q_docs)
            except Exception as e:
                logger.warning("retrieve_query_failed query=%s error=%s", q[:120], str(e))
    else:
        try:
            all_docs = retriever.get_relevant_documents(topic)
        except Exception as e:
            logger.warning("retrieve_topic_failed topic=%s error=%s", topic[:120], str(e))

    # Deduplicate by normalized page content
    seen: Set[str] = set()
    dedup_docs: List[Any] = []
    for d in all_docs:
        content = (getattr(d, "page_content", None) or "").strip()
        if not content:
            continue
        key = content.replace("\n", " ")
        if key in seen:
            continue
        seen.add(key)
        dedup_docs.append(d)

    # Sample contexts using seeded RNG for variation across runs
    num_contexts = max(1, int(state.get("num_contexts") or 4))
    try:
        import random
        rng = random.Random(seed)
        sampled_docs = dedup_docs[:]
        rng.shuffle(sampled_docs)
        sampled_docs = sampled_docs[: min(num_contexts, len(sampled_docs))]
    except Exception:
        sampled_docs = dedup_docs[: min(num_contexts, len(dedup_docs))]

    # Log sampled docs metadata and preview
    try:
        for i, d in enumerate(sampled_docs[:10]):
            meta = getattr(d, "metadata", {}) or {}
            logger.info(
                "research_doc idx=%s meta=%s preview=%s",
                i,
                meta,
                (d.page_content[:200] if getattr(d, "page_content", None) else ""),
            )
        logger.info(
            "topic_retrieve queries=%s docs_total=%s docs_used=%s topic=%s",
            len(queries) or 0,
            len(dedup_docs),
            len(sampled_docs),
            topic[:120],
        )
    except Exception:
        pass

    return {**state, "retrieved": [{"content": d.page_content, "meta": (getattr(d, "metadata", {}) or {})} for d in sampled_docs]}


class ChoiceModel(BaseModel):
    label: str
    text: str


class MCQModel(BaseModel):
    question: str
    choices: List[ChoiceModel]
    correct: str
    rationale: str
    evidence: str
    section: str
class QueryExpansionModel(BaseModel):
    queries: List[str]


def expand_queries_node(model_name: str):
    """Generate diverse, specific search queries from the topic.

    The goal is to improve retrieval diversity by proposing multiple concrete
    phrases, synonyms, statute references, named entities, and subtopics.
    """
    def node(state: AgentState) -> AgentState:
        topic = state["topic"]
        llm = ChatOpenAI(model=model_name, temperature=0.7)
        structured_llm = llm.with_structured_output(QueryExpansionModel)
        prompt = (
            "You expand a study topic into diverse short search queries for a vector database.\n"
            "Return a JSON object with a 'queries' array of 5-8 items.\n"
            "Queries should be specific and varied: include synonyms, key phrases,\n"
            "canonical terminology, relevant statute/section identifiers if applicable,\n"
            "named entities, and related subtopics.\n"
            "Keep each query under 12 words. Avoid redundancy.\n\n"
            f"Topic: {topic}"
        )
        try:
            result: QueryExpansionModel = structured_llm.invoke(prompt)
            queries = [q.strip() for q in result.queries if isinstance(q, str) and q.strip()]
        except Exception:
            queries = [topic]

        # Seeded shuffle and trimming based on query_fanout
        seed = state.get("seed")
        query_fanout = max(1, int(state.get("query_fanout") or 5))
        try:
            import random
            rng = random.Random(seed)
            rng.shuffle(queries)
            queries = queries[: min(query_fanout * 2, len(queries))]  # keep some extras for retrieval stage
        except Exception:
            queries = queries[: min(query_fanout * 2, len(queries))]

        # Log expanded queries for observability
        try:
            logger.info(
                "research_expanded_queries topic=%s count=%s queries=%s",
                topic[:120],
                len(queries),
                queries,
            )
        except Exception:
            pass

        return {**state, "queries": queries}

    return node



def make_question_node(model_name: str):
    def question_node(state: AgentState) -> AgentState:
        # Temperature scales with diversity
        diversity = float(state.get("diversity") or 0.5)
        temperature = max(0.2, min(0.2 + diversity * 0.8, 0.9))
        # Encourage paraphrasing and reduce repetition with penalties
        freq_penalty = 0.0 + 0.6 * diversity
        pres_penalty = 0.0 + 0.4 * diversity
        llm = ChatOpenAI(
            model=model_name,
            temperature=temperature,
            frequency_penalty=round(freq_penalty, 2),
            presence_penalty=round(pres_penalty, 2),
            top_p=1.0,
        )
        structured_llm = llm.with_structured_output(MCQModel)
        context_items = state.get("retrieved", [])
        context = "\n\n".join([d["content"] for d in context_items])[:6000]
        variation_id = state.get("variation_id")
        # Log generation parameters and a summary of contexts
        try:
            logger.info(
                "question_gen diversity=%s temp=%s penalties=%s contexts=%s variation_id=%s",
                diversity,
                temperature,
                {"frequency_penalty": round(freq_penalty, 2), "presence_penalty": round(pres_penalty, 2)},
                len(context_items),
                variation_id,
            )
        except Exception:
            pass
        instructions = (
            "You are a tutor creating a single multiple-choice question (MCQ) based strictly on the provided context.\n"
            f"- Topic: {state['topic']}\n"
            "- Avoid explicit or graphic content; use neutral, legal/educational framing.\n"
            "- Create a short scenario that tests understanding of the topic.\n"
            "- Provide exactly one question and 4 answer choices labeled A-D.\n"
            "- Indicate the correct letter and provide a brief rationale.\n"
            "- Also include an 'evidence' string quoting or closely paraphrasing the specific context segment supporting the correct answer.\n"
            "- Strongly vary scenario details each time: change setting, actors, stakes, time period, and phrasing so successive runs are noticeably different.\n"
            f"- Variation ID: {variation_id}. Use this to diversify scenario style and wording deterministically.\n"
            "- Prefer concrete, domain-specific details (e.g., procurement, licensing, reporting, penalties) drawn from context.\n"
            "- Use plausible distractors that are contextually grounded, not generic.\n"
            "- Also include a 'section' string indicating the exact statute/section number (e.g., 'Sec. 22.041(b)') where the evidence comes from if present; else return an empty string.\n"
            "- Output must conform exactly to the schema.\n"
            "Context:\n" + context
        )
        try:
            result: MCQModel = structured_llm.invoke(instructions)
            data = result.model_dump()
        except Exception:
            data = {"question": state["topic"], "choices": [], "correct": "A", "rationale": "", "evidence": "", "section": ""}
        return {**state, "question": data}

    return question_node


def build_graph(model_name: str = "gpt-4.1-mini"):
    graph = StateGraph(AgentState)
    graph.add_node("expand_queries", expand_queries_node(model_name))
    graph.add_node("retrieve", retrieve_node)
    graph.add_node("generate_question", make_question_node(model_name))
    graph.set_entry_point("expand_queries")
    graph.add_edge("expand_queries", "retrieve")
    graph.add_edge("retrieve", "generate_question")
    graph.add_edge("generate_question", END)
    return graph.compile()

@app.post("/api/upload-pdf")
async def upload_pdf(request: Request, file: UploadFile = File(...), api_key: str = None):
    if not api_key:
        raise HTTPException(status_code=400, detail="API key is required")
    
    try:
        # Read the PDF file
        logger.info("upload_pdf_read_file request_id=%s filename=%s", request.state.request_id, file.filename)
        contents = await file.read()
        
        # Extract text from PDF
        text_chunks = extract_text_from_pdf(contents)
        logger.info(
            "upload_pdf_extracted_chunks request_id=%s chunks=%s",
            request.state.request_id,
            len(text_chunks),
        )
        
        if not text_chunks:
            raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")
        
        # Build LangChain vector store for agent (Qdrant)
        os.environ["OPENAI_API_KEY"] = api_key
        splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150)
        # Preserve filename and chunk index for observability
        base_docs = [Document(page_content="\n\n".join(text_chunks), metadata={"filename": file.filename})]
        docs = splitter.split_documents(base_docs)
        for i, d in enumerate(docs):
            d.metadata = {**(getattr(d, "metadata", {}) or {}), "chunk_index": i}
        embeddings = OpenAIEmbeddings()
        # Use remote Qdrant if QDRANT_URL is set; otherwise fall back to in-memory
        qdrant_url = os.getenv("QDRANT_URL")
        if qdrant_url:
            app.state.qa_store = Qdrant.from_documents(
                documents=docs,
                embedding=embeddings,
                url=qdrant_url,
                collection_name="pdf_chunks",
            )
        else:
            app.state.qa_store = Qdrant.from_documents(
                documents=docs,
                embedding=embeddings,
                location=":memory:",
                collection_name="pdf_chunks",
            )

        # Extract hierarchical topics from each chunk and aggregate (optional; disabled)
        # client = OpenAI(api_key=api_key)
        # topics_list = await extract_topics_for_chunks(text_chunks, client)
        # app.state.topics_set = set(topics_list)
        # logger.info(
        #     "upload_pdf_extracted_topics request_id=%s topics=%s",
        #     request.state.request_id,
        #     len(topics_list),
        # )
        
        return {
            "message": "PDF processed successfully",
            "chunk_count": len(docs),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Ensure OpenAI API key is available for embedding queries if needed
        if request.api_key:
            os.environ["OPENAI_API_KEY"] = request.api_key

        # If we don't have an in-memory vector db and no qa_store set yet, but Qdrant is configured,
        # try to lazily attach to the existing collection so chat works after reloads.
        if app.state.qa_store is None:
            qdrant_url = os.getenv("QDRANT_URL")
            if qdrant_url:
                try:
                    embeddings = OpenAIEmbeddings()
                    client = QdrantClient(url=qdrant_url)
                    app.state.qa_store = Qdrant(
                        client=client,
                        collection_name="pdf_chunks",
                        embeddings=embeddings,
                    )
                    logger.info("chat_lazy_qdrant_attach url=%s collection=pdf_chunks", qdrant_url)
                except Exception as e:
                    logger.warning("chat_lazy_qdrant_attach_failed error=%s", str(e))

        # Proceed even if in-memory vectors are absent; we'll try Qdrant or use empty context

        # Get relevant chunks from Qdrant if available
        relevant_chunks: List[str] = []
        if app.state.qa_store is not None:
            retriever = app.state.qa_store.as_retriever(search_kwargs={"k": 6, "search_type": "mmr", "fetch_k": 20, "lambda_mult": 0.7})
            docs = retriever.get_relevant_documents(request.user_message)
            relevant_chunks = [d.page_content for d in docs]
            logger.info("chat_retrieved_chunks source=qdrant k=%s retrieved=%s", 6, len(relevant_chunks))
        logger.info("chat_retrieved_chunks relevant_chunks=%s", relevant_chunks)
        # Create the system message with context
        system_message = f"""You are a helpful AI assistant that answers questions based ONLY on the provided context. 
If the question cannot be answered using the context, say that you cannot answer the question with the available information.
Do not make up or infer information that is not in the context.

Context from the PDF:
{' '.join(relevant_chunks)}"""

        # Initialize OpenAI client with the provided API key
        client = OpenAI(api_key=request.api_key)
        
        # Build messages including optional history
        messages: List[dict] = [
            {"role": "system", "content": system_message},
        ]

        # Append prior turns if provided (only roles user/assistant/system)
        if request.history:
            for m in request.history[-20:]:
                role = m.role if m.role in {"user", "assistant", "system"} else "user"
                content = m.content or ""
                if content.strip():
                    messages.append({"role": role, "content": content})

        # Append the new user message
        messages.append({"role": "user", "content": request.user_message})

        # Create an async generator function for streaming responses
        async def generate():
            # Create a streaming chat completion request
            stream = client.chat.completions.create(
                model=request.model,
                messages=messages,
                stream=True  # Enable streaming response
            )
            
            # Yield each chunk of the response as it becomes available
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        # Handle any errors that occur during processing
        raise HTTPException(status_code=500, detail=str(e)) from e

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


@app.post("/api/topic-question")
async def topic_question(req: TopicQuestionRequest):
    try:
        # Ensure OpenAI key is set for embeddings
        if req.api_key:
            os.environ["OPENAI_API_KEY"] = req.api_key

        # Lazily attach to an existing Qdrant collection if qa_store is not yet set
        if app.state.qa_store is None:
            qdrant_url = os.getenv("QDRANT_URL")
            if qdrant_url:
                try:
                    embeddings = OpenAIEmbeddings()
                    client = QdrantClient(url=qdrant_url)
                    app.state.qa_store = Qdrant(
                        client=client,
                        collection_name="pdf_chunks",
                        embeddings=embeddings,
                    )
                    logger.info("topic_question_lazy_qdrant_attach url=%s collection=pdf_chunks", qdrant_url)
                except Exception as e:
                    logger.warning("topic_question_lazy_qdrant_attach_failed error=%s", str(e))
        print("building graph")
        # Proceed even if qa_store could not be attached; graph will operate with empty retrieval
        graph = build_graph(req.model or "gpt-4.1-mini")
        # Compute a variation id if not provided
        import random
        computed_variation = req.variation_id if req.variation_id is not None else (req.seed if req.seed is not None else random.randint(1, 10_000_000))
        result = graph.invoke({
            "topic": req.topic,
            "queries": [],
            "retrieved": [],
            "seed": computed_variation,
            "diversity": req.diversity,
            "num_contexts": req.num_contexts,
            "query_fanout": req.query_fanout,
            "variation_id": computed_variation,
        })
        # Do not generate if no context was retrieved
        if not result.get("retrieved"):
            raise HTTPException(status_code=400, detail="No relevant context found for the topic. Upload a PDF or configure QDRANT_URL.")
        q = result.get("question", {})
        # Optionally truncate choices to the requested number
        if isinstance(q.get("choices"), list) and req.num_choices > 0:
            q["choices"] = q["choices"][: req.num_choices]
        return q
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
