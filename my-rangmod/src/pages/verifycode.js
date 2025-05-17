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
      setMessage({ text: "Please enter the verification code", isError: true });
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
          text: "OTP verified successfully!", 
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

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setIsResending(true);
    
    const email = localStorage.getItem('resetEmail');
    if (!email) {
      setMessage({ text: "Email not found. Please try forgot password again.", isError: true });
      setIsResending(false);
      return;
    }

    try {
      const res = await axios.post("/api/auth/resendotp", { email });
      if (res.status === 200) {
        setMessage({ 
          text: "New verification code has been sent to your email!", 
          isError: false 
        });
      } else {
        setMessage({ 
          text: "Failed to resend verification code. Please try again.", 
          isError: true 
        });
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setMessage({ 
        text: "Failed to resend verification code. Please try again.", 
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
              <div className={`${message.isError ? styles.errorMessage : styles.successMessage} ${!message.isError ? styles.greenText : ''}`}>
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
            <p>Didn't receive code? <a href="#" onClick={handleResendOTP} className={styles.signInLink}>{isResending ? "SENDING..." : "RESEND"}</a></p>
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