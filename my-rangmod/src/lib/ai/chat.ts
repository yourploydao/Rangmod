export const getChatResponse = async (question: string): Promise<string> => {
  // 1. ดึง context จาก API
  const contextRes = await fetch("/api/ai/context", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question }),
  })

  const contextData = await contextRes.json()
  const context = contextData.context || ""

  // 2. ส่ง context + question ไปยัง FastAPI
  const res = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, context }),
  })

  const data = await res.json()
  return data.answer
}
