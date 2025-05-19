import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/forgotpassword.module.css";
import { useRouter } from 'next/navigation';

const RangModForgotPassword = () => {
  // State variable for email input
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email) {
      setMessage({ text: "กรุณาใส่ที่อยู่อีเมลของคุณ", isError: true });
      setIsSubmitting(false);
      return;
    }

    const payload = { email };

    try {
      const res = await axios.post("/api/auth/forgot-password", payload);
      const data = res.data;

      if (res.status === 200 ) {
        setMessage({ 
          text: data.message || "รหัสผ่านใหม่ได้ถูกส่งไปยังที่อยู่อีเมลของคุณแล้ว!", 
          isError: false 
        });
        // Save email to localStorage
        localStorage.setItem('resetEmail', email)

        router.push("/verifycode");
      } else {
        setMessage({ 
          text: data.error || data.message || "คำขอของท่านล้มเหลว", 
          isError: true 
        });
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage({ 
        text: "มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง", 
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSide}>
        <div className={styles.logo} onClick={() => router.push('/homepage')} style={{cursor: 'pointer'}}>
          <img src="/assets/rangmodlogo.png" alt="RangMod Logo" />
          <span className={styles.logoText}>RANGMOD</span>
        </div>
        
        <div className={styles.formContainer}>
          <h1 className={styles.title}>ลืมรหัสผ่าน</h1>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>ที่อยู่อีเมล</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.fieldInput}
              />
            </div>
            
            {message.text && (
              <div className={message.isError ? styles.errorMessage : styles.successMessage}>
                {message.text}
              </div>
            )}
            
            <button 
              type="submit" 
              className={styles.createButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังส่ง..." : "ส่ง OTP เรียบร้อยแล้ว"}
            </button>
          </form>
          
          <div className={styles.signInSection}>
            <p>จำรหัสผ่านได้แล้ว? <a href="/signin" className={styles.signInLink}>เข้าสู่ระบบ</a></p>
          </div>
        </div>
        
        <div className={styles.footer}>
          <p>สงวนลิขสิทธิ์ทุกประการ © 2025</p>
        </div>
      </div>
      
      <div className={styles.imageSide}>
        {/* This is the background image side */}
      </div>
    </div>
  );
};

export default RangModForgotPassword;