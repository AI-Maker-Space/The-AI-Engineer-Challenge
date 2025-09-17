from pathlib import Path
from typing import Iterable, List

import PyPDF2


class TextFileLoader:
    """Load plain-text documents from a single file or an entire directory."""

    def __init__(self, path: str, encoding: str = "utf-8"):
        self.path = Path(path)
        self.encoding = encoding
        self.documents: List[str] = []

    def load(self) -> None:
        """Populate ``self.documents`` from the configured path."""

        self.documents = list(self._iter_documents())

    def load_file(self) -> None:
        """Load a single file specified by ``self.path``."""

        self.documents = [self._read_text_file(self.path)]

    def load_directory(self) -> None:
        """Load all text files contained within ``self.path``."""

        self.documents = list(self._iter_directory(self.path))

    def load_documents(self) -> List[str]:
        """Convenience wrapper returning the loaded documents."""

        self.load()
        return self.documents

    def _iter_documents(self) -> Iterable[str]:
        if self.path.is_dir():
            yield from self._iter_directory(self.path)
        elif self.path.is_file() and self.path.suffix.lower() == ".txt":
            yield self._read_text_file(self.path)
        else:
            raise ValueError(
                "Provided path must be a directory or a .txt file: " f"{self.path}"
            )

    def _iter_directory(self, directory: Path) -> Iterable[str]:
        for entry in sorted(directory.rglob("*.txt")):
            if entry.is_file():
                yield self._read_text_file(entry)

    def _read_text_file(self, file_path: Path) -> str:
        with file_path.open("r", encoding=self.encoding) as file_handle:
            return file_handle.read()


class CharacterTextSplitter:
    """Naively split long strings into overlapping character chunks."""

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ):
        if chunk_size <= chunk_overlap:
            raise ValueError("Chunk size must be greater than chunk overlap")

        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split(self, text: str) -> List[str]:
        """Split ``text`` into chunks preserving the configured overlap."""

        step = self.chunk_size - self.chunk_overlap
        return [text[i : i + self.chunk_size] for i in range(0, len(text), step)]

    def split_texts(self, texts: List[str]) -> List[str]:
        """Split multiple texts and flatten the resulting chunks."""

        chunks: List[str] = []
        for text in texts:
            chunks.extend(self.split(text))
        return chunks


class PDFLoader:
    """Extract text from PDF files stored at a path."""

    def __init__(self, path: str):
        self.path = Path(path)
        self.documents: List[str] = []

    def load(self) -> None:
        """Populate ``self.documents`` from the configured path."""

        self.documents = list(self._iter_documents())

    def load_file(self) -> None:
        """Load a single PDF specified by ``self.path``."""

        self.documents = [self._read_pdf(self.path)]

    def load_directory(self) -> None:
        """Load all PDF files contained within ``self.path``."""

        self.documents = list(self._iter_directory(self.path))

    def load_documents(self) -> List[str]:
        """Convenience wrapper returning the loaded documents."""

        self.load()
        return self.documents

    def _iter_documents(self) -> Iterable[str]:
        if self.path.is_dir():
            yield from self._iter_directory(self.path)
        elif self.path.is_file() and self.path.suffix.lower() == ".pdf":
            yield self._read_pdf(self.path)
        else:
            raise ValueError(
                "Provided path must be a directory or a .pdf file: " f"{self.path}"
            )

    def _iter_directory(self, directory: Path) -> Iterable[str]:
        for entry in sorted(directory.rglob("*.pdf")):
            if entry.is_file():
                yield self._read_pdf(entry)

    def _read_pdf(self, file_path: Path) -> str:
        with file_path.open("rb") as file_handle:
            pdf_reader = PyPDF2.PdfReader(file_handle)
            extracted_pages = [page.extract_text() or "" for page in pdf_reader.pages]
        return "\n".join(extracted_pages)


if __name__ == "__main__":
    loader = TextFileLoader("data/KingLear.txt")
    loader.load()
    splitter = CharacterTextSplitter()
    chunks = splitter.split_texts(loader.documents)
    print(len(chunks))
    print(chunks[0])
    print("--------")
    print(chunks[1])
    print("--------")
    print(chunks[-2])
    print("--------")
    print(chunks[-1])
