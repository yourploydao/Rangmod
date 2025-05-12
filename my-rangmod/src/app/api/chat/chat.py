from fastapi import APIRouter, Request
from rag.rag_pipeline import generate_rag_answer
from db.mongo import conversations
from datetime import datetime

router = APIRouter()

@router.post("/chat")
async def chat(req: Request):
    body = await req.json()
    question = body["question"]
    user_id = body.get("user_id", "anonymous")
    answer = generate_rag_answer(question)

    conversations.insert_one({
        "user_id": user_id,
        "question": question,
        "answer": answer,
        "timestamp": datetime.utcnow()
    })

    return {"answer": answer}
