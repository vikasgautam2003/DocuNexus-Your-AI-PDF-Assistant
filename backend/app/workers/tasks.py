import asyncio
from celery import shared_task
from app.services.ingestion import ingest_document
from app.core.celery_app import celery_app


@celery_app.task(name="process_document")
def process_document_task(file_path: str, file_id: str):

    print(f"⚡ [Worker] Received task for file: {file_id}")

    try:
        loop = asyncio.get_event_loop()
        result = loop.run_until_complete(ingest_document(file_path, file_id))
        
        print(f"✅ [Worker] Successfully ingested {file_id}. Chunks: {result['chunks_count']}")
 
    except Exception as e:
        print(f"🔥 [Worker] Failed to process {file_id}: {e}")
        
        raise e