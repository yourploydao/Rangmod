import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/verifyemail.module.css";
import { useRouter } from "next/navigation";

const RangModVerifyEmail = () => {
  // State variables
  const [otp, setOtp] = useState("");
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

    const email = localStorage.getItem('resetEmail');
    const payload = {
      email: email,
      otp: otp
    };

    if (!otp || otp.length < 6) {
      setMessage({ text: "Please enter a valid 6-digit OTP", isError: true });
      setIsSubmitting(false);
      return;
    }

    try {
      // Replace with your actual API endpoint
      const res = await axios.post("http://localhost:3000/api/auth/verifyemail", payload);
      const data = res.data;

      if (res.status === 200 && data.status === "ok") {
        setMessage({ 
          text: data.message || "Email verified successfully!", 
          isError: false 
        });

        // Save OTP to localStorage
        localStorage.setItem('resetOtp', otp);     // Store OTP in localStorage

        // Redirect user after successful verification
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        setMessage({ 
          text: data.error || data.message || "Invalid or expired OTP", 
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

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    try {
      // Replace with your actual API endpoint
      const res = await axios.post("http://localhost:3000/api/auth/resendotp", { email });
      const data = res.data;

      if (res.status === 200 && data.status === "ok") {
        setMessage({ 
          text: "A new OTP has been sent to your email", 
          isError: false 
        });
        // Start countdown timer
        setCountdown(60);
      } else {
        setMessage({ 
          text: data.error || data.message || "Failed to resend OTP", 
          isError: true 
        });
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setMessage({ 
        text: "Something went wrong. Please try again later.", 
        isError: true 
      });
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
        <div className={styles.logo}>
          <img src="/assets/mocklogo.jpeg" alt="RangMod Logo" />
          <span className={styles.logoText}>RANGMOD</span>
        </div>
        
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Verify Email Address</h1>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>OTP IN YOUR EMAIL</label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                className={styles.fieldInput}
                maxLength={6}
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
          
          <div className={styles.resendSection}>
            <p>
              Didn't receive the code?{" "}
              <button 
                onClick={handleResendOtp} 
                className={`${styles.resendLink} ${countdown > 0 ? styles.resendLinkDisabled : ""}`}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "RESEND OTP"}
              </button>
            </p>
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

export default RangModVerifyEmail;