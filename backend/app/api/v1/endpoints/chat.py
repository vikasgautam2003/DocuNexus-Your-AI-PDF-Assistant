from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agents.rag import rag_app


router = APIRouter()


class ChatRequest(BaseModel):
    query: str
    file_id: str

class ChatResponse(BaseModel):
    answer: str



@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try: 
        result = await rag_app.ainvoke({"question": request.query, "file_id": request.file_id})
        return ChatResponse(answer=result["answer"])

    except Exception as e:
        print(f"🔥 Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))