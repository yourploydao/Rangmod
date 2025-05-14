import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/resetpassword.module.css";
import { useRouter } from "next/navigation";

const RangModResetPassword = () => {
  // State variables for form inputs
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    const email = localStorage.getItem('resetEmail'); // Retrieve the email stored
    const otp = localStorage.getItem('resetOtp'); // Retrieve the OTP stored

    if (!email || !otp) {
      alert("Missing email or OTP for reset. Please start the reset process again.");
      router.push("/forgotpassword");
      return;
    }

    const payload = {
      email: email,
      otp: otp,
      newPassword: newPassword,
    };

    try {
      const res = await axios.post("http://localhost:3000/api/auth/resetpassword", payload);
      const data = res.data;

      if (res.status === 200 && data.status === "ok") {
        alert(data.message || "Password reset successfully!");

        router.push("/signin");
      } else {
        alert(data.error || data.message || "Password reset failed");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      alert("Something went wrong. Please try again later.");
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
          <h1 className={styles.title}>Reset Password</h1>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
                <label className={styles.fieldLabel}>NEW PASSWORD</label>
                <div className={styles.passwordWrapper}>
                <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.fieldInput}
                />
                <button 
                    type="button" 
                    className={styles.togglePassword}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                >
                    <img 
                    src={
                        showNewPassword
                        ? "https://cdn-icons-png.flaticon.com/128/2767/2767194.png" // show password icon
                        : "https://cdn-icons-png.flaticon.com/128/4855/4855030.png" // hide password icon
                    }
                    alt="Toggle password visibility"
                    width="28"
                    height="28"
                    />
                </button>
                </div>
            </div>
            
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>CONFIRM PASSWORD</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.fieldInput}
                />
                <button 
                  type="button" 
                  className={styles.togglePassword}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img 
                    src={
                        showConfirmPassword
                        ? "https://cdn-icons-png.flaticon.com/128/2767/2767194.png" // show password icon
                        : "https://cdn-icons-png.flaticon.com/128/4855/4855030.png" // hide password icon
                    } 
                    alt="Toggle password visibility"
                    width="28"
                    height="28"
                  />
                </button>
              </div>
            </div>
            
            <button type="submit" className={`${styles.createButton} ${styles.confirmButton}`}>
              CONFIRM
            </button>
          </form>
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

export default RangModResetPassword;