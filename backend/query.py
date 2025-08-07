#!/usr/bin/env python3
import os
import numpy as np
from groq import Groq
from sentence_transformers import SentenceTransformer, CrossEncoder
from chromadb import PersistentClient

from config import PERSIST_DIRECTORY
from utils  import load_texts, chunk_text
from dotenv import load_dotenv
# Load the .env file
load_dotenv()

# ── 1) Initialize SBERT embedder & cross-encoder ────────────────────────
embedder      = SentenceTransformer("all-MiniLM-L6-v2")
embedding_dim = embedder.get_sentence_embedding_dimension()
reranker      = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-12-v2")

def embed_query(texts: list[str]) -> np.ndarray:
    """
    Return SBERT embeddings for `texts` as a numpy array of shape (len(texts), D).
    """
    if not texts:
        return np.zeros((0, embedding_dim), dtype="float32")
    vecs = embedder.encode(texts, show_progress_bar=False)
    return np.array(vecs, dtype="float32")

# ── 2) Initialize Groq client for chat ───────────────────────────────────
groq = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── 3) Initialize persistent ChromaDB on disk ───────────────────────────
client     = PersistentClient(PERSIST_DIRECTORY)
collection = client.get_or_create_collection(name="docs")

# ── 4) Retrieval + re-ranking ───────────────────────────────────────────
def retrieve_and_rerank(query: str, top_k: int = 50, rerank_k: int = 5):
    # a) Embed query → [[…D floats…]]
    qvecs = embed_query([query]).tolist()

    # b) ANN search in ChromaDB
    result = collection.query(
        query_embeddings=qvecs,
        n_results=top_k,
        include=["documents", "metadatas"]
    )
    docs = result["documents"][0]
    metas = result["metadatas"][0]

    # c) Re-rank top_k → top rerank_k
    pairs  = [[query, d] for d in docs]
    scores = reranker.predict(pairs)
    top    = sorted(zip(scores, docs, metas), key=lambda x: -x[0])[:rerank_k]
    return [(doc, meta) for _, doc, meta in top]

# ── 5) Assemble prompt & call Groq ──────────────────────────────────────
def answer(query: str) -> str:
    top_ctx = retrieve_and_rerank(query)
    context = "\n\n".join(f"[{m['source']}] {d}" for d, m in top_ctx)

    system = (
        "You are an expert assistant. Answer using ONLY the context below. "
        "If the answer is not contained, say 'I don’t know.' "
        "Show your reasoning step by step."
    )
    messages = [
        {"role": "system", "content": system},
        {"role": "user",   "content": f"{context}\n\nQuestion: {query}\nAnswer:"}
    ]

    resp = groq.chat.completions.create(
        model="llama-3.3-70b-versatile",

        messages=messages,
        max_tokens=500,
    )
    return resp.choices[0].message.content.strip()

# ── CLI Entrypoint ───────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser(description="RAG query with SBERT + Groq + ChromaDB")
    p.add_argument("--query", required=True, help="Your question")
    args = p.parse_args()
    print(answer(args.query))
