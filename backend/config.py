import os

# OpenAI & embedding
EMBED_MODEL     = "text-embedding-gecko-001"
CHUNK_TOKENS    = 500

# ChromaDB persistence
PERSIST_DIRECTORY = os.getenv("CHROMA_PERSIST_DIR", "./chromadb_data")
