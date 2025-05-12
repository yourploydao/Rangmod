"use client"
import { useState } from "react"
import axios from "axios"

export default function ChatPage() {
  const [question, setQ] = useState("")
  const [answer, setA] = useState("")

  const handleSend = async () => {
    const res = await axios.post("http://localhost:3000/api/chat", { question })
    setA(res.data.answer)
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>แชทกับ Dorm AI</h1>
      <textarea value={question} onChange={(e) => setQ(e.target.value)} />
      <br />
      <button onClick={handleSend}>ส่งคำถาม</button>
      <p><strong>คำตอบ:</strong> {answer}</p>
    </main>
  )
}
