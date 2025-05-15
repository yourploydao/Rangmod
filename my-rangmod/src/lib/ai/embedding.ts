// src/lib/ai/embedding.ts
export async function getLocalEmbedding(text: string): Promise<number[]> {
  const res = await fetch('http://localhost:11434/api/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'nomic-embed-text', // หรือ embed model ที่คุณใช้ใน Ollama
      prompt: text
    })
  })

  const data = await res.json()
  return data.embedding
}
