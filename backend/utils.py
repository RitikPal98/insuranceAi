import glob
import os
from tiktoken import get_encoding
from PyPDF2 import PdfReader

# Use the same tokenizer as your embedding model
ENC = get_encoding("cl100k_base")

def load_texts(folder: str):
    """
    Read all .txt and .pdf files in `folder` and return
    a list of (filename, full_text) tuples.
    """
    docs = []
    for path in glob.glob(os.path.join(folder, "*")):
        ext = os.path.splitext(path)[1].lower()
        text = None

        if ext == ".txt":
            with open(path, encoding="utf-8") as f:
                text = f.read()

        elif ext == ".pdf":
            reader = PdfReader(path)
            # concatenate all pages
            pages = []
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    pages.append(page_text)
            text = "\n\n".join(pages)

        if text:
            docs.append((os.path.basename(path), text))

    return docs

def chunk_text(text: str, max_tokens: int):
    """
    Split `text` into chunks of up to `max_tokens` tokens,
    using the same tokenizer as the embedding model.
    """
    tokens = ENC.encode(text)
    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i : i + max_tokens]
        chunk_text = ENC.decode(chunk_tokens)
        chunks.append(chunk_text)
    return chunks
