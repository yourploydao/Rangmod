import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/router";
import Link from 'next/link';
import styles from "../styles/chatbot.module.css";
import Header from "../components/navigation";
import Footer from "../components/footer";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const chatBoxRef = useRef(null); // 👈 ref สำหรับกล่องแชท

  const handleSend = () => {
    if (input.trim() === "") return;
    const newMessages = [...messages, { sender: "user", text: input }, { sender: "bot", text: "ขอบคุณที่ส่งข้อความเข้ามา!" }];
    setMessages(newMessages);
    setInput("");
  };

  useEffect(() => {
    // 👇 scroll chatbox ให้เลื่อนไปด้านล่าง
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
