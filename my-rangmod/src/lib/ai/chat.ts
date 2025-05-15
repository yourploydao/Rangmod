// src/lib/ai/chat.ts
import { askOllama } from './ollama'
import { searchSimilar } from './vectorSearch'

export async function generateAnswer(userQuestion: string): Promise<string> {
  const contexts = await searchSimilar(userQuestion)
  const contextText = contexts.map(c => `- ${c}`).join('\n')

  const prompt = `
คุณคือแชทบอทแนะนำหอพักในกรุงเทพ
คำถาม: ${userQuestion}
ข้อมูลหอพัก:
${contextText}
โปรดตอบคำถามโดยอิงจากข้อมูลด้านบน ใช้ภาษาที่สุภาพ
  `.trim()

  return await askOllama(prompt)
}
