import React, { useState } from "react";
import styles from "../styles/signin.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const RangModSignIn = () => {
  // State variables for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: email,
      password: password,
      rememberMe: rememberMe,
    };

    try {
      const res = await axios.post("http://localhost:3000/api/auth/signin", payload);
      const data = res.data;

      if (res.status === 200 ) {
        alert(data.message || "Signed in successfully!");
        
        // เก็บ JWT token ตามตัวเลือก rememberMe
        if (rememberMe) {
          localStorage.setItem("token", data.token); // เก็บใน localStorage ถ้า rememberMe ถูกเลือก
        } else {
          sessionStorage.setItem("token", data.token); // หรือเก็บใน sessionStorage ถ้าไม่เลือก rememberMe
        }

        // หลังจากล็อกอินสำเร็จ ไปดึงข้อมูลตัวเอง
        
        const me = await axios.get("http://localhost:3000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${data.token}`, // ส่ง token ใน header
          },
        });
        
        //* อย่าลืมมาเซ็ต path ว่าไปไหน *//

        if (me.data.role === "admin") {
          // ถ้าเป็น admin ให้ไปที่ /admin/dashboard
          router.push("/admin-dashboard");
        } else if (me.data.role === "user") {
          // ถ้าเป็น user ให้ไปที่ /user/dashboard
          router.push("/homepage-before-login");
        } else if (me.data.role === "owner") {
          // ถ้าเป็น user ให้ไปที่ /owner/dashboard
          router.push("/owner-dashboard");
        } else {
          alert("Unknown role");
        }
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
          <img src="/assets/mocklogo.jpeg" alt="RangMod Logo" />
          <span className={styles.logoText}>RANGMOD</span>
        </div>
        
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Sign In to RangMod</h1>
          
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
                  // placeholder="••••••••••"
                />
                <button 
                  type="button" 
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img 
                    src="https://cdn-icons-png.flaticon.com/128/4855/4855030.png" 
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
          
          <div className={styles.signInSection}>
            <p>Don't have an account? <a href="/signup" className={styles.signInLink}>SIGN UP</a></p>
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