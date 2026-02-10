

# import os
# import chromadb
# from langchain_core.vectorstores import VectorStore
# from langchain_chroma import Chroma
# from langchain_google_genai import GoogleGenerativeAIEmbeddings

# # Chroma runs inside Docker on port 8000 (internal network)
# CHROMA_HOST = "chromadb" 
# CHROMA_PORT = 8000

# def get_embeddings():
#     return GoogleGenerativeAIEmbeddings(
#         model="models/gemini-embedding-001",
#         api_key=os.getenv("GOOGLE_API_KEY")
#     )

# def get_vector_store(namespace: str) -> VectorStore:
#     """
#     Returns a Chroma Vector Store isolated by Collection.
#     'namespace' (file_id) becomes the collection_name.
#     """
    
#     # 1. Connect to the Chroma Server (running in Docker)
#     try:
#         client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
#     except Exception as e:
#         raise ConnectionError(f"Could not connect to ChromaDB at {CHROMA_HOST}:{CHROMA_PORT}. Is Docker running?") from e

#     embeddings = get_embeddings()

#     # 2. Return the store connected to the specific File ID collection
#     # Chroma handles creating the collection automatically if it doesn't exist.
#     return Chroma(
#         client=client,
#         collection_name=namespace,  # <--- ISOLATION HAPPENS HERE
#         embedding_function=embeddings,
#     )











from app.core.config import settings
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

def get_vector_store(namespace: str):
    print(f"🔥 [DEBUG] Loading Vector Store for {namespace} (Cloud Mode Check)") 
    
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001", 
        google_api_key=settings.GOOGLE_API_KEY
    )

    if not settings.CHROMA_CLOUD_API_KEY:
        raise ValueError("❌ CRITICAL: CHROMA_CLOUD_API_KEY is missing!")

    print(f"☁️ [System] Connecting to Chroma Cloud...")
    return Chroma(
        collection_name=namespace,
        embedding_function=embeddings,
        chroma_cloud_api_key=settings.CHROMA_CLOUD_API_KEY,
        tenant=settings.CHROMA_TENANT,
        database=settings.CHROMA_DATABASE,
    )