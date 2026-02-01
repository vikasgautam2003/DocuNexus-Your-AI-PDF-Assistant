from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DocumentResponse(BaseModel):
    id: str
    filename: str
    content_type: str
    size: int
    upload_date: datetime
    status: str
    task_id: Optional[str] = None