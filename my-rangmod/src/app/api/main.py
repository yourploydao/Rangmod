# ✅ main.py (ใช้ model ที่ merge แล้วแบบ Ollama-compatible)
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import requests

# ✅ สร้าง FastAPI app
app = FastAPI()

# ✅ เปิดให้ frontend access ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # หรือใส่ ["http://localhost:3000"] เพื่อเจาะจง
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ โหลด tokenizer และ merged model (ที่ merge LoRA แล้ว)
model_path = "./models/qwen-merged"
tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    trust_remote_code=True,
    torch_dtype=torch.float16  # หรือ "auto" ก็ได้
).to("cpu")  # ✅ ใช้ CPU แทน .cuda()

# ✅ สำหรับรับ input จาก frontend
class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat(request: ChatRequest):
    print(f"📩 ได้รับคำถาม: {request.question}")

    try:
        contextRes = requests.post(
            "http://localhost:3000/api/ai/context",
            json={"query": request.question},
            timeout=10
        )
        contextRes.raise_for_status()
        contextData = contextRes.json()
        context = contextData.get("context", "")
    except Exception as e:
        print(f"⚠️ context error: {e}")
        context = ""

    context_part = f"Context:\n{context.strip()}\n\n" if context else ""

    prompt = f"""คุณคือแชทบอทแนะนำหอพักในประเทศไทย ห้ามใช้ภาษาจีน และให้ตอบเฉพาะภาษาไทยเท่านั้น

{context_part}Q: {request.question}
A:"""

    try:
        inputs = tokenizer(prompt, return_tensors="pt").to("cpu")
        input_len = inputs.input_ids.shape[-1]

        outputs = model.generate(
            **inputs,
            max_new_tokens=256,
            do_sample=True,
            top_p=0.9,
            temperature=0.7,
            pad_token_id=tokenizer.eos_token_id
        )

        generated_tokens = outputs[0][input_len:]
        answer = tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()

        print(f"✅ ตอบกลับ: {answer}")
        return { "answer": answer or "ขออภัย ฉันยังไม่มีข้อมูลสำหรับคำถามนี้" }
    
    except Exception as e:
        print(f"❌ generate error: {e}")
        return { "answer": "เกิดข้อผิดพลาดระหว่างประมวลผลคำถาม" }