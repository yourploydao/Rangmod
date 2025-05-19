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
      alert("รหัสผ่านไม่ตรงกัน โปรดลองอีกครั้ง");
      return;
    }

    const email = localStorage.getItem('resetEmail'); // Retrieve the email stored
    const otp = localStorage.getItem('resetOtp'); // Retrieve the OTP stored

    if (!email || !otp) {
      alert("ไม่มีอีเมลรือรัสผ่าน OTP สำรับเปลี่ยนรหัสผ่าน กรุณาทำการเปลี่ยนรัสผ่านใหม่อีกครั้งม");
      router.push("/forgotpassword");
      return;
    }

    const payload = {
      email: email,
      otp: otp,
      newPassword: newPassword,
    };

    try {
      const res = await axios.post("/api/auth/resetpassword", payload);
      const data = res.data;

      if (res.status === 200 ) {
        alert(data.message || "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว!");

        router.push("/signin");
      } else {
        alert(data.error || data.message || "เปลี่ยนรหัสผ่านล้มเหลว");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      alert("มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง");
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
              <label className={styles.fieldLabel}>ยืนยันรหัสผ่าน</label>
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
              ยืนยัน
            </button>
          </form>
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

export default RangModResetPassword;