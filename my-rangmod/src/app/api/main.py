# ✅ main.py (ใช้ model ที่ merge แล้วแบบ Ollama-compatible)

from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import requests  # ✅ ต้องใช้เพื่อ fetch context จาก Next.js
import os

app = FastAPI()

# ✅ โหลด model ที่ merge แล้ว
model_path = os.path.abspath("models/qwen-merged")
tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    trust_remote_code=True,
    torch_dtype=torch.float16,
    device_map="auto"
)

class ChatInput(BaseModel):
    question: str

@app.post("/chat")
async def chat(input: ChatInput):
    try:
        # ✅ 1. ขอ context จาก Next API
        context_api_url = "http://localhost:3000/api/ai/context"
        response = requests.post(context_api_url, json={"query": input.question})
        context = response.json().get("context", "")

        # ✅ 2. สร้าง prompt
        prompt = f"""คุณคือแชทบอทแนะนำหอพักในประเทศไทย ห้ามใช้ภาษาจีน และให้ตอบเฉพาะภาษาไทยเท่านั้น

Q: {context}\n{input.question}
A:"""

        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        input_length = inputs.input_ids.shape[-1]

        outputs = model.generate(
            **inputs,
            max_new_tokens=256,
            do_sample=False,
            temperature=0.7,
            top_p=0.9,
            pad_token_id=tokenizer.eos_token_id
        )

        generated_tokens = outputs[0][input_length:]
        answer = tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()

        return {"answer": answer}
    except Exception as e:
        return {"error": str(e)}
