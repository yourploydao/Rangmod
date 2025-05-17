import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/router";
import Link from 'next/link';
import styles from "../styles/chatbot.module.css";
import Header from "../components/navigation";
import Footer from "../components/footer";
import { getChatResponse } from "../lib/ai/chat.ts";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const botReply = await getChatResponse(input);
      const botMessage = { sender: "bot", text: botReply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsg = { sender: "bot", text: "เกิดข้อผิดพลาดในการเชื่อมต่อ AI" };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainWide}>
        <h1 className={styles.title}>พูดคุยกับเรา</h1>
        <div className={styles.chatbox} ref={chatBoxRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.sender === "user" ? styles.userMsg : styles.botMsg}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            className={styles.input}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className={styles.sendButton}>ส่ง</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
