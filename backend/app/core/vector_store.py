






# import os
# from langchain_core.vectorstores import VectorStore
# from langchain_qdrant import Qdrant
# from langchain_qdrant import QdrantVectorStore
# from langchain_pinecone import PineconeVectorStore
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from qdrant_client import QdrantClient
# from qdrant_client.models import VectorParams, Distance


# COLLECTION_NAME = "docunexus_local"
# EMBED_DIM = 3072   # Gemini embedding dimension


# def get_embeddings():
#     return GoogleGenerativeAIEmbeddings(
#         model="models/gemini-embedding-001",
#         api_key=os.getenv("GOOGLE_API_KEY")
#     )


# def get_vector_store() -> VectorStore:
#     env = os.getenv("APP_ENV", "dev")
#     embeddings = get_embeddings()

#     if env == "prod":
#         if not os.getenv("PINECONE_API_KEY"):
#             raise ValueError("PINECONE_API_KEY is missing in production!")

#         return PineconeVectorStore(
#             index_name=os.getenv("PINECONE_INDEX", "hybrid"),
#             embedding=embeddings,
#             namespace=os.getenv("PINECONE_NAMESPACE", "default")
#         )


#     qdrant_url = os.getenv("QDRANT_URL", "http://qdrant:6333")

#     client = QdrantClient(url=qdrant_url, prefer_grpc=True)

#     existing = [c.name for c in client.get_collections().collections]

#     if COLLECTION_NAME not in existing:
#         client.create_collection(
#             collection_name=COLLECTION_NAME,
#             vectors_config=VectorParams(
#                 size=EMBED_DIM,
#                 distance=Distance.COSINE
#             )
#         )

#     return Qdrant(
#         client=client,
#         collection_name=COLLECTION_NAME,
#         embeddings=embeddings
#     )


import os
import chromadb
from langchain_core.vectorstores import VectorStore
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Chroma runs inside Docker on port 8000 (internal network)
CHROMA_HOST = "chromadb" 
CHROMA_PORT = 8000

def get_embeddings():
    return GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        api_key=os.getenv("GOOGLE_API_KEY")
    )

def get_vector_store(namespace: str) -> VectorStore:
    """
    Returns a Chroma Vector Store isolated by Collection.
    'namespace' (file_id) becomes the collection_name.
    """
    
    # 1. Connect to the Chroma Server (running in Docker)
    try:
        client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
    except Exception as e:
        raise ConnectionError(f"Could not connect to ChromaDB at {CHROMA_HOST}:{CHROMA_PORT}. Is Docker running?") from e

    embeddings = get_embeddings()

    # 2. Return the store connected to the specific File ID collection
    # Chroma handles creating the collection automatically if it doesn't exist.
    return Chroma(
        client=client,
        collection_name=namespace,  # <--- ISOLATION HAPPENS HERE
        embedding_function=embeddings,
    )