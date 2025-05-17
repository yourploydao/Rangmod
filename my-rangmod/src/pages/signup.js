'use client';

import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/signup.module.css";
import { useRouter } from "next/navigation";


const RangModLogin = () => {
  // State variables for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const router = useRouter();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!agreeTerms) {
    alert("คุณต้องยอมรับเงื่อนไขการให้บริการและนโยบายความเป็นส่วนตัวก่อน");
    return;
  }

  const payload = {
    name: name,
    email: email,
    phone: phone,
    username: username,
    password: password,
    profile_picture: 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
  };

  try {
    const res = await axios.post("/api/auth/signup", payload);
    const data = res.data;

    // Log API response data
    console.log("Data from API:", data);

    if (res.status === 201) {
      // Save email to localStorage
      localStorage.setItem('email', email);
      
      // Show success message
      alert(data.message || "สร้างบัญชีสำเร็จแล้ว!");
      
      // Redirect to verify email page
      router.push("/verifyemail");
    } else {
      alert(data.message || "ลงทะเบียนไม่สำเร็จ");
    }
  } catch (err) {
    console.error("Registration error:", err);
    if (err.response?.data?.message) {
      alert(err.response.data.message);
    } else {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง");
    }
  }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSide}>
        <div className={styles.logo} onClick={() => router.push('/homepage')} style={{cursor: 'pointer'}}>
          <image src="/assets/rangmodlogo.png" alt="RangMod Logo" />
          <span className={styles.logoText}>RANGMOD</span>
        </div>
        
        <div className={styles.formContainer}>
          <h1 className={styles.title}>ลงทะเบียนเพื่อใช้งานเว็บไซต์ Rangmod</h1>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>ชื่อ-นามสกุล</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.fieldInput}
              />
            </div>
            
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
              <label className={styles.fieldLabel}>เบอร์ไทรศัพท์</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.fieldInput}
              />
            </div>
            
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>ชื่อผู้ใช้</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                  <image 
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
            
            <div className={styles.termsCheckbox}>
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className={styles.checkbox} 
              />
              <label htmlFor="terms" className={styles.checkboxLabel}>
              ข้าพเจ้ายอมรับ <a href="#" className={styles.termsLink}>เงื่อนไขการให้บริการ</a> และ <a href="#" className={styles.termsLink}>นโยบายความเป็นส่วนตัว</a>
              </label>
            </div>
            
            <button type="submit" className={styles.createButton}>
            สร้างบัญชี
            </button>
          </form>
          
          <div className={styles.signInSection}>
            <p>มีบัญชีอยู่แล้ว? <a href="/signin" className={styles.signInLink}>เข้าสู่ระบบ</a></p>
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

export default RangModLogin;