import os
from langchain_core.vectorstores import VectorStore
from langchain_qdrant import Qdrant
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from qdrant_client import QdrantClient



PINECONE_INDEX="hybrid"


# def get_embeddings():
#     return GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")


# def get_vector_store():
#     env = 