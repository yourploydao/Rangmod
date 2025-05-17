# ✅ main.py (ใช้ model ที่ merge แล้วแบบ Ollama-compatible)
from fastapi import FastAPI
from pydantic import BaseModel
import requests
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# โหลด model ที่ merge LoRA แล้ว
model_path = "./models/qwen-merged"
tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "left"

model = AutoModelForCausalLM.from_pretrained(
    model_path,
    trust_remote_code=True,
    torch_dtype=torch.float16,
    device_map="auto"
)

app = FastAPI()

class ChatInput(BaseModel):
    question: str

@app.post("/chat")
async def chat(input: ChatInput):
    # ✅ 1. เรียก context จาก vector search API
    try:
        rag_resp = requests.post("http://localhost:3000/api/ai/context", json={"query": input.question})
        rag_context = rag_resp.json().get("context", "")
    except Exception:
        rag_context = ""

    # ✅ 2. สร้าง prompt แบบ plain
    prompt = f"""คุณคือแชทบอทแนะนำหอพักในประเทศไทย ห้ามใช้ภาษาจีน และให้ตอบเฉพาะภาษาไทยเท่านั้น

{rag_context}

Q: {input.question}
A:"""

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    input_length = inputs.input_ids.shape[-1]

    outputs = model.generate(
        **inputs,
        max_new_tokens=256,
        do_sample=False,
        pad_token_id=tokenizer.eos_token_id
    )

    answer = tokenizer.decode(outputs[0][input_length:], skip_special_tokens=True).strip()
    return { "answer": answer }

