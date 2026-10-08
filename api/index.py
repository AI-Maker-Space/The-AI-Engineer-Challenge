from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from pydantic import BaseModel, Field
from typing import Literal
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Use app.state to store OpenAI client
app.state.client = None
app.state.message_history = []
class ChatRequest(BaseModel):
    message: str

class ApiKeyRequest(BaseModel):
    OPENAI_API_KEY: str

class WeatherEntity(BaseModel):
    """Parameters describing what the weather is like in a given location."""
    weather_date: str = Field(description="The date and time of the weather data")
    location: str = Field(description="The location to get the weather for")
    temperature: float = Field(description="The temperature in degrees Fahrenheit")
    feels_like: float = Field(description="The temperature in degrees Fahrenheit")
    wind_speed: float = Field(description="The wind speed in miles per hour")
    weather_type: Literal[
        "sunny",      # clear sky, bright sun
        "rainy",      # rainfall
        "cloudy",     # overcast/cloud cover
        "snowy",      # falling snow/snow-covered
        "stormy",     # thunderstorms, heavy rain, lightning
        "foggy",      # reduced visibility, fog present
        "windy",      # strong winds
        "hazy",       # reduced clarity, often due to pollution
        "drizzle",    # light rain
        "sleet",      # rain and snow mix
        "hail",       # small balls of ice
        "blizzard",   # severe snowstorm with strong winds
        "hot",        # very high temperatures
        "cold",       # very low temperatures
        "freezing",   # at or below 0°C/32°F
        "humid",      # high moisture in the air
        "dry",        # low humidity
        "dusty",      # dust storms, reduced air quality
        "overcast",   # sky completely covered with clouds
        "tornado"     # tornado occurrence
    ] = Field(description="The mose representative state of the current weather at the location.")
    description: str = Field(description="A brief over all description of the weather at the location.")
    response: str = Field(
        description=(
            "A natural, conversational reply to the user's latest message: acknowledge their question, "
            "give the weather in plain language, and sound like a helpful chat assistant (not JSON)."
        )
    )

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/set-api-key")
def set_api_key(request: ApiKeyRequest):
    """
    Endpoint to set the OpenAI API key using a Pydantic model.
    Accepts a JSON payload: {"OPENAI_API_KEY": "<YOUR_API_KEY>"}
    """
    if not request.OPENAI_API_KEY:
        raise HTTPException(status_code=400, detail="Missing OPENAI_API_KEY in request body")
    # Store the OpenAI client in app.state
    os.environ["OPENAI_API_KEY"] = request.OPENAI_API_KEY
    return {"status": "API key set successfully"}


@app.post("/api/chat")
def chat(request: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    try:
       history = app.state.message_history[-5:]
       user_message = request.message
       model = app.state.client or ChatOpenAI(model="gpt-5.2")
       system_message = SystemMessage(
           "You are a helpful agent that can provide current weather information for any location on the planet. "
           "When asked about the weather in any place, you retrieve and share the latest weather details clearly and accurately. "
           "Always fill the structured fields AND write the `response` field as a friendly chat message that answers "
           "the user's question in full sentences (like a text conversation)."
       )
       # Structured output returns a Pydantic model; AIMessage content must be a string for the chat history.
       llm = model.with_structured_output(WeatherEntity)
       response = llm.invoke([system_message, *history, HumanMessage(user_message)])
       history.append(HumanMessage(user_message))
       history.append(AIMessage(content=response.model_dump_json()))
       app.state.message_history = [*history]

       return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")
