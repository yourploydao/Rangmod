from vector_store.embedder import get_embedding
from vector_store.faiss_indexer import load_index
import openai, os

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_context(q):
    index, texts = load_index()
    q_emb = get_embedding(q).reshape(1, -1)
    _, I = index.search(q_emb, k=3)
    return [texts[i] for i in I[0]]

def generate_rag_answer(question):
    context = get_context(question)
    prompt = f"""
Context:
{chr(10).join(context)}

Q: {question}
A:"""
    res = openai.ChatCompletion.create(
        model=os.getenv("GPT_MODEL"),  # fine-tuned model id
        messages=[
            {"role": "system", "content": "คุณคือผู้ช่วยเกี่ยวกับหอพัก"},
            {"role": "user", "content": prompt}
        ]
    )
    return res.choices[0].message["content"]
