# import os
# from langchain_core.vectorstores import VectorStore
# from langchain_qdrant import Qdrant
# from langchain_pinecone import PineconeVectorStore
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from qdrant_client import QdrantClient



# PINECONE_INDEX="hybrid"


# def get_embeddings():
#     return GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")


# def get_vector_store() -> VectorStore:
#     env = os.getenv("APP_ENV", "dev")
#     embeddings = get_embeddings()


#     if env == "prod":
#         if not os.getenv("PINECONE_API_KEY"):
#             raise ValueError("PINECONE_API_KEY is missing in production!")

#         return PineconeVectorStore(
#             index_name=os.getenv("PINECONE_INDEX"),
#             embedding=embeddings,
#             namespace=os.getenv("PINECONE_NAMESPACE", "default")
#         )
    
#     else:
#         qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")

#         return Qdrant.from_existing_collection(
#             embedding=embeddings,
#             collection_name="docunexus_local",
#             url=qdrant_url,
#             prefer_grpc=True
#         )








import os
from langchain_core.vectorstores import VectorStore
from langchain_qdrant import Qdrant
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance


COLLECTION_NAME = "docunexus_local"
EMBED_DIM = 3072   # Gemini embedding dimension


def get_embeddings():
    return GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        api_key=os.getenv("GOOGLE_API_KEY")
    )


def get_vector_store() -> VectorStore:
    env = os.getenv("APP_ENV", "dev")
    embeddings = get_embeddings()

    if env == "prod":
        if not os.getenv("PINECONE_API_KEY"):
            raise ValueError("PINECONE_API_KEY is missing in production!")

        return PineconeVectorStore(
            index_name=os.getenv("PINECONE_INDEX", "hybrid"),
            embedding=embeddings,
            namespace=os.getenv("PINECONE_NAMESPACE", "default")
        )

    # DEV → Qdrant
    qdrant_url = os.getenv("QDRANT_URL", "http://qdrant:6333")

    client = QdrantClient(url=qdrant_url, prefer_grpc=True)

    existing = [c.name for c in client.get_collections().collections]

    if COLLECTION_NAME not in existing:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=EMBED_DIM,
                distance=Distance.COSINE
            )
        )

    return Qdrant(
        client=client,
        collection_name=COLLECTION_NAME,
        embeddings=embeddings
    )






