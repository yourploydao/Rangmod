// src/lib/ai/ollama.ts
export async function askOllama(prompt: string): Promise<string> {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen1.5-0.5b-lora', // ชื่อจริงของ fine-tuned model ที่ convert ลง Ollama
      prompt,
      stream: false
    })
  })

  const data = await res.json()
  return data.response.trim()
}
