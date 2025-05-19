import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from tqdm import tqdm

# ===== 🔧 ตั้งค่า model path =====
model_path = "./models/qwen-merged"
device = "cuda" if torch.cuda.is_available() else "cpu"

# ===== ✅ โหลด model และ tokenizer =====
tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(model_path, trust_remote_code=True).to(device)
model.eval()

# ===== 📂 โหลด dataset =====
dataset_path = "fine-tune-dataset.jsonl"
samples = []
with open(dataset_path, "r", encoding="utf-8") as f:
    for line in f:
        data = json.loads(line.strip())
        samples.append(data)

# ===== 📊 วัด Accuracy =====
correct = 0
total = 0

for item in tqdm(samples, desc="Evaluating"):
    prompt = item["prompt"]
    expected_answer = item["completion"].strip().replace("<|im_end|>", "").strip()

    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=100,
            do_sample=False,
            pad_token_id=tokenizer.eos_token_id
        )
    
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # 🔍 ดึงเฉพาะส่วนที่โมเดลตอบกลับ (ตัด prompt ออก)
    if prompt in generated_text:
        answer_only = generated_text.split(prompt, 1)[-1].strip()
    else:
        answer_only = generated_text.strip()

    # ✅ เทียบแบบ contains (ไม่ต้องเหมือนเป๊ะทุกคำ)
    if expected_answer in answer_only:
        correct += 1
    total += 1

accuracy = correct / total if total > 0 else 0
print(f"\n✅ Accuracy: {accuracy:.4f} ({correct}/{total})")
