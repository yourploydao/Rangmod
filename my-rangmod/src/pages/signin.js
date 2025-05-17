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
      const res = await axios.post("/api/auth/signin", payload);
      const data = res.data;

      if (res.status === 200 ) {
        alert(data.message || "เข้าสู่ระบบสำเร็จ!");
        
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
          router.push("/admin/dashboard");
        } else if (me.data.role === "user") {
          // ถ้าเป็น user ให้ไปที่ /user/dashboard
          router.push("/homepage");
        } else if (me.data.role === "owner") {
          // ถ้าเป็น user ให้ไปที่ /owner/dashboard
          router.push("/owner-dashboard");
        } else {
          alert("Unknown role");
        }
      } else {
        alert(data.error || data.message || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง");
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
          <h1 className={styles.title}>เข้าสู่ระบบเว็บไซต์ Rangmod</h1>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>อีเมล</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.fieldInput}
              />
            </div>
            
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>รหัสผ่าน</label>
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
                จดจำข้อมูลฉันไว้
                </label>
              </div>
              <a href="/forgotpassword" className={styles.forgotPasswordLink}>ลืมรหัสผ่าน?</a>
            </div>
            
            <button type="submit" className={styles.createButton}>
            เข้าสู่ระบบ
            </button>
          </form>
          
          <div className={styles.resendSection}>
            <p>ยังไม่มีบัญชีใช่ไหม? <a href="/signup" className={styles.resendLink}>ลงทะเบียน</a></p>
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

export default RangModSignIn;