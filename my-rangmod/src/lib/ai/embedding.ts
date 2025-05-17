// src/lib/ai/embedding.ts

export async function getLocalEmbedding(text: string): Promise<number[]> {
  const cleaned = text.replace(/\n/g, ' ').trim(); // ทำความสะอาดข้อความ (เช่น ลบ newline และ trim)

  const res = await fetch('http://localhost:11434/api/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'nomic-embed-text', // เปลี่ยนชื่อโมเดลหากใช้ตัวอื่นใน Ollama
      prompt: cleaned
    })
  });

  if (!res.ok) {
    throw new Error(`Embedding failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.embedding) {
    throw new Error('Embedding not found in response');
  }

  return data.embedding;
}
