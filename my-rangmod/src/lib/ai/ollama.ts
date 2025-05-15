// src/lib/ai/ollama.ts
export async function askOllama(prompt: string): Promise<string> {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen1.5:4b-instruct', // ชื่อที่คุณจะ convert ใส่ทีหลัง
      prompt,
      stream: false
    })
  })

  const data = await res.json()
  return data.response.trim()
}
