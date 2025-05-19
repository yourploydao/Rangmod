import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/verifycode.module.css";
import { useRouter } from "next/navigation";

const VerifyCodeForgotpassword = () => {
  // State variable for OTP input
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const email = localStorage.getItem('resetEmail');

    if (!otp) {
      setMessage({ text: "กรุณากรอกรหัสยืนยัน", isError: true });
      setIsSubmitting(false);
      return;
    }

    const payload = { 
      email: email,
      otp: otp
    };

    try {
      const res = await axios.post("/api/auth/verifyotp", payload);
      const data = res.data;

      if (res.status === 200) {
        setMessage({ 
          text: "ยืนยีนรหัส OTP สำเร็จแล้ว!", 
          isError: false 
        });

        // Save email and OTP to localStorage
        localStorage.setItem('resetEmail', email);
        localStorage.setItem('resetOtp', otp);

        // Redirect to reset password page after successful verification
        setTimeout(() => {
          router.push("/resetpassword");
        }, 1500);
      } else {
        setMessage({ 
          text: data.error || data.message || "รหัสยืนยันไม่ถูกต้อง", 
          isError: true 
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setMessage({ 
        text: "มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง", 
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setIsResending(true);
    
    const email = localStorage.getItem('resetEmail');
    if (!email) {
      setMessage({ text: "ไม่พบอีเมลในระบบ กรุณาใช้เมนูลืมรัสผ่านใม่อีกครั้ง", isError: true });
      setIsResending(false);
      return;
    }

    try {
      const res = await axios.post("/api/auth/resendotp", { email });
      if (res.status === 200) {
        setMessage({ 
          text: "รหัสผ่านใหม่ได้ถูกส่งไปยังที่อยู่อีเมลของคุณแล้ว", 
          isError: false 
        });
      } else {
        setMessage({ 
          text: "การส่งรหัสยืนยันล้มเหลว กรุณาลองอีกครั้ง", 
          isError: true 
        });
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setMessage({ 
        text: "การส่งรหัสยืนยันล้มเหลว กรุณาลองอีกครั้ง", 
        isError: true 
      });
    } finally {
      setIsResending(false);
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
          <h1 className={styles.title}>ยืนยันรหัส</h1>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>รหัส OTP ในอีเมลของคุณ</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={styles.fieldInput}
                maxLength="6"
              />
            </div>
            
            {message.text && (
              <div className={`${message.isError ? styles.errorMessage : styles.successMessage} ${!message.isError ? styles.greenText : ''}`}>
                {message.text}
              </div>
            )}
            
            <button 
              type="submit" 
              className={styles.createButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังตรวจสอบ..." : "ยืนยัน"}
            </button>
          </form>
          
          <div className={styles.signInSection}>
            <p>ไม่ได้รับรหัส? <a href="#" onClick={handleResendOTP} className={styles.signInLink}>{isResending ? "SENDING..." : "RESEND"}</a></p>
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

export default VerifyCodeForgotpassword;