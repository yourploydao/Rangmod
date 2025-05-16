import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/verifyemail.module.css";
import { useRouter } from "next/navigation";

const RangModVerifyEmail = () => {
  // State variables
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false); // Added missing state variable
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  // Handle OTP input change
  const handleOtpChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^\d]/g, '');
    // Limit to 6 digits
    setOtp(value.slice(0, 6));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const email = localStorage.getItem('email');
    const payload = {
      email: email,
      otp: otp
    };

    if (!otp || otp.length < 6) {
      setMessage({ text: "กรุณาใส่รหัส OTP ที่ถูกต้อง 6 หลัก", isError: true });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/verifyemail", payload);
      const data = res.data;

      if (res.status === 200) {
        setMessage({ 
          text: data.message || "ยืนยันอีเมลสำเร็จแล้ว!", 
          isError: false 
        });

        // Redirect user after successful verification
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        setMessage({ 
          text: data.message || "รหัส OTP ไม่ถูกต้องหรือหมดอายุแล้ว", 
          isError: true 
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setMessage({ 
        text: err.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง", 
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        setMessage({ text: "ไม่พบอีเมล กรุณาลงทะเบียนใหม่อีกครั้ง", isError: true });
        return;
      }

      const res = await fetch("/api/auth/resendverification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setMessage({ text: data.message, isError: false });
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setMessage({ text: data.message || "ส่งรหัส OTP ใหม่ล้มเหลว", isError: true });
      }
    } catch (error) {
      setMessage({ text: "ส่งรหัส OTP ใหม่ล้มเหลว", isError: true });
    }
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className={styles.container}>
      <div className={styles.formSide}>
        <div className={styles.logo} onClick={() => router.push('/homepage')} style={{cursor: 'pointer'}}>
          <img src="/assets/rangmodlogo.png" alt="RangMod Logo" />
          <span className={styles.logoText}>RANGMOD</span>
        </div>
        
        <div className={styles.formContainer}>
          <h1 className={styles.title}>ยืนยันที่อยู่อีเมล</h1>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>รหัส OTP ในอีเมลของคุณ</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showOtp ? "text" : "password"}
                  value={otp}
                  onChange={handleOtpChange}
                  className={styles.fieldInput}
                  maxLength={6}
                />
                <button 
                  type="button" 
                  className={styles.togglePassword}
                  onClick={() => setShowOtp(!showOtp)}
                >
                  <img 
                    src={
                      showOtp
                      ? "https://cdn-icons-png.flaticon.com/128/2767/2767194.png" // show password icon
                      : "https://cdn-icons-png.flaticon.com/128/4855/4855030.png" // hide password icon
                    }
                    alt="Toggle OTP visibility"
                    width="28"
                    height="28"
                  />
                </button>
              </div>
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
              {isSubmitting ? "กำลังตรวจสอบ..." : "ยืนยันรหัส OTP"}
            </button>
          </form>
          
          <div className={styles.resendSection}>
            <p>
            ไม่ได้รับรหัสใช่ไหม?{" "}
              <button 
                onClick={handleResendOtp} 
                className={`${styles.resendLink} ${countdown > 0 ? styles.resendLinkDisabled : ""}`}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `ส่งอีกครั้งใน ${countdown} วินาที` : "ส่งรหัส OTP อีกครั้ง"}
              </button>
            </p>
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

export default RangModVerifyEmail;