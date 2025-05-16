import React, { useState } from "react";
import styles from "../styles/signin.module.css";

const RangModSignIn = () => {
  // State variables for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: email,
      password: password,
      rememberMe: rememberMe
    };

    try {
      // Replace with your actual API endpoint
      const res = await fetch("https://api.rangmod.com/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status === "ok") {
        alert(data.message || "Signed in successfully!");
        window.location.href = "/dashboard";
      } else {
        alert(data.error || data.message || "Sign in failed");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSide}>
        <div className={styles.logo}>
          <img src="/assets/rangmodlogo.png" alt="RangMod Logo" />
          <span className={styles.logoText}>RANGMOD</span>
        </div>
        
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Sign in to Rangmod</h1>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.fieldInput}
              />
            </div>
            
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>PASSWORD</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.fieldInput}
                />
                <button 
                  type="button" 
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img 
                    src={
                      showPassword
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
            
            <div className={styles.signinOptions}>
              <div className={styles.termsCheckbox}>
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={styles.checkbox} 
                />
                <label htmlFor="remember" className={styles.checkboxLabel}>
                  Remember Me
                </label>
              </div>
              <a href="/forgotpassword" className={styles.forgotPasswordLink}>Forgot Password?</a>
            </div>
            
            <button type="submit" className={styles.createButton}>
              SIGN IN
            </button>
          </form>
          
          <div className={styles.resendSection}>
            <p>Don't have an account? <a href="/signup" className={styles.resendLink}>SIGN UP</a></p>
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

export default RangModSignIn;