import React, { useState } from "react";
import styles from "../styles/verifycode.module.css";

const VerifyCodeForgotpassword = () => {
  // State variable for OTP input
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", isError: false });

    if (!otp) {
      setMessage({ text: "Please enter the verification code", isError: true });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      otp: otp
    };

    try {
      // Replace with your actual API endpoint
      const res = await fetch("https://api.rangmod.com/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status === "ok") {
        setMessage({ 
          text: data.message || "Email verified successfully!", 
          isError: false 
        });
        // Redirect to reset password page after successful verification
        setTimeout(() => {
          window.location.href = "/reset-password";
        }, 1500);
      } else {
        setMessage({ 
          text: data.error || data.message || "Invalid verification code", 
          isError: true 
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setMessage({ 
        text: "Something went wrong. Please try again later.", 
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSide}>
        <div className={styles.logo}>
          <img src="/assets/mocklogo.jpeg" alt="RangMod Logo" />
          <span className={styles.logoText}>RANGMOD</span>
        </div>
        
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Verify Code</h1>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>OTP IN YOUR EMAIL</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={styles.fieldInput}
                maxLength="6"
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
              {isSubmitting ? "VERIFYING..." : "CONFIRM"}
            </button>
          </form>
          
          <div className={styles.signInSection}>
            <p>Didn't receive code? <a href="/forgot-password" className={styles.signInLink}>RESEND</a></p>
          </div>
        </div>
        
        <div className={styles.footer}>
          <p>© 2025 All Rights Reserved.</p>
        </div>
      </div>
      
      <div className={styles.imageSide}>
        {/* This is the background image side */}
      </div>
    </div>
  );
};

export default VerifyCodeForgotpassword;