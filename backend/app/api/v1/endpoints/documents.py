import shutil
import os
import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from app.schemas.document import DocumentResponse

router = APIRouter()


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...)
):
    if not file.content_type.startswith("application/pdf"):
        raise HTTPException(400, detail="Only PDF files are allowed.")
    
    file_id = str(uuid.uuid4())
    extension = os.path.splitext(file.filename)[1]

    safe_filename = f"{file_id}{extension}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)


    try: 
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
    

    fake_task_id = "task_" + file_id


    return DocumentResponse(
        id=file_id,
        filename=file.filename,
        content_type=file.content_type,
        size=os.path.getsize(file_path),
        upload_date=datetime.utcnow(),
        status="pending",
        task_id=fake_task_id
    )