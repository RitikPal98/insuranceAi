# import os, requests
# import uuid
# import openai
# import numpy as np
# from chromadb import Client
# from chromadb.config import Settings
# from config import OPENAI_API_KEY, EMBED_MODEL, CHUNK_TOKENS, PERSIST_DIRECTORY
# from utils import load_texts, chunk_text
# from sentence_transformers import SentenceTransformer

# openai.api_key = OPENAI_API_KEY
# GROQ_EMBED_URL = "https://api.groq.com/v1/embeddings"  
# GROQ_API_KEY = OPENAI_API_KEY
# sbert = SentenceTransformer("all-MiniLM-L6-v2")

# # def embed_texts(texts):
# #     """
# #     Creates embeddings via openai>=1.0.0.
# #     Returns List[List[float]].
# #     """
# #     if not texts:
# #         return []
# #     resp = openai.embeddings.create(
# #         model=EMBED_MODEL,
# #         input=texts
# #     )
# #     return [item["embedding"] for item in resp["data"]]

# def embed_texts(texts):
#     """
#     Generate embeddings locally via Sentence-Transformers.
#     Returns List[List[float]].
#     """
#     if not texts:
#         return []
#     # .tolist() so it’s pure Python floats
#     return sbert.encode(texts, show_progress_bar=True).tolist()
# def build_index(docs_folder):
#     # 1) Load & chunk your docs
#     docs = load_texts(docs_folder)
#     chunks, metadatas, ids = [], [], []
#     for fname, body in docs:
#         for chunk in chunk_text(body, CHUNK_TOKENS):
#             uid = str(uuid.uuid4())
#             chunks.append(chunk)
#             metadatas.append({"source": fname})
#             ids.append(uid)

#     if not chunks:
#         print(f"[build_index] ⚠️  No chunks found in '{docs_folder}'.")
#         print("  • Make sure you have .txt files there (or extend load_texts to support PDF/DOCX).")
#         return

#     # 2) Embed
#     print(f"[build_index] embedding {len(chunks)} chunks…")
#     vectors = embed_texts(chunks)

#     # 3) Initialize ChromaDB with the new 'settings=' signature
#     client = Client(
#         settings=Settings(
#             chroma_db_impl="duckdb+parquet",
#             persist_directory=PERSIST_DIRECTORY,
#             anonymized_telemetry=False
#         )
#     )
#     coll = client.get_or_create_collection(name="docs")

#     # 4) Upsert
#     coll.upsert(
#         embeddings=vectors,
#         metadatas=metadatas,
#         ids=ids,
#         documents=chunks
#     )
#     client.persist()

#     print(f"[build_index] ✅  Done. DB persisted to '{PERSIST_DIRECTORY}'")

# if __name__ == "__main__":
#     import argparse
#     p = argparse.ArgumentParser()
#     p.add_argument("--docs", required=True, help="Path to docs folder")
#     args = p.parse_args()
#     build_index(args.docs)

#!/usr/bin/env python3
import uuid
from sentence_transformers import SentenceTransformer
from chromadb import PersistentClient

from config import CHUNK_TOKENS, PERSIST_DIRECTORY
from utils  import load_texts, chunk_text

# 1) Load SBERT once
sbert = SentenceTransformer("all-MiniLM-L6-v2")

def embed_texts(texts: list[str]) -> list[list[float]]:
    """Local embeddings via SBERT."""
    if not texts:
        return []
    return sbert.encode(texts, show_progress_bar=True).tolist()

def build_index(docs_folder: str):
    # 2) Load & chunk
    docs = load_texts(docs_folder)
    chunks, metadatas, ids = [], [], []
    for fname, body in docs:
        for chunk in chunk_text(body, CHUNK_TOKENS):
            uid = str(uuid.uuid4())
            chunks.append(chunk)
            metadatas.append({"source": fname})
            ids.append(uid)

    if not chunks:
        print(f"[build_index] ⚠️ No chunks found in '{docs_folder}'.")
        print("  • Make sure you have .txt/.pdf files there (or extend load_texts).")
        return

    # 3) Embed
    print(f"[build_index] embedding {len(chunks)} chunks…")
    vectors = embed_texts(chunks)

    # 4) Initialize **persistent** ChromaDB client (no Settings needed) :contentReference[oaicite:0]{index=0}
    client = PersistentClient(PERSIST_DIRECTORY)
    coll   = client.get_or_create_collection(name="docs")

    # 5) Upsert
    coll.upsert(
        embeddings=vectors,
        metadatas=metadatas,
        ids=ids,
        documents=chunks,
    )

    # PersistentClient writes immediately
    print(f"[build_index] ✅ DB written to '{PERSIST_DIRECTORY}'")

if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--docs", required=True, help="Path to docs folder")
    args = p.parse_args()
    build_index(args.docs)
