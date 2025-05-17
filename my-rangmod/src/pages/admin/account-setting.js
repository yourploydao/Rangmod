import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import styles from "../../styles/admin-account-setting.module.css";
import SidebarAdmin from '@/components/sidebar-setting-admin';

const AdminAccountSetting = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    role: 'Admin',
    profile_picture: 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.status === 200) {
          const user = response.data;
          setUserData({
            name: user.name || user.username,
            username: user.username,
            phone: user.phone || 'Not set',
            email: user.email,
            role: user.role || 'Admin',
            profile_picture: user.profile_picture || 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
          });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        if (err.response?.status === 401) {
          router.push('/signin');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);
  
  const handleEditButtonClick = () => {
    console.log('กดปุ่มแก้ไขแล้ว');
    try {
      router.push("/admin/edit-setting");
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการไปยังหน้าการแก้ไข:', error);
    }
  };
  
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('token');
      router.push("/signin");
    } catch (err) {
      console.error('ออกจากระบบไม่สำเร็จ:', err);
      alert('ออกจากระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    }
  };
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>กรุณารอสักครู่...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <SidebarAdmin />
        
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.greeting}>
              <h1>สวัสดี, {userData.username}</h1>
              <p>ขอให้มีวันที่ดีนะ!</p>
            </div>
            
            <div className={styles.headerRightSection}>
              <div className={styles.userInfo}>
                <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
                  <image 
                    src={userData.profile_picture} 
                    alt="Profile" 
                    className={styles.profileImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png';
                    }}
                  />
                  <span className={styles.profileName}>{userData.username}</span>
                  <svg className={styles.dropdownArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  
                  {showDropdown && (
                    <div className={styles.dropdownMenu}>
                      <div className={styles.dropdownItem} onClick={handleLogout}>
                        <div className={styles.dropdownIcon}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                        </div>
                        <span>ออกจากระบบ</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.profileHeaderLeft}>
                <div className={styles.profileAvatar}>
                  <image 
                    src={userData.profile_picture} 
                    alt="Profile Avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png';
                    }}
                  />
                </div>
                <div className={styles.profileInfo}>
                  <h2 className={styles.profileName}>{userData.name}</h2>
                  <p className={styles.profileEmail}>{userData.email}</p>
                </div>
              </div>
              <div className={styles.profileHeaderRight}>
                <button 
                  className={styles.editButton} 
                  onClick={handleEditButtonClick}
                >
                  แก้ไข
                </button>
              </div>
            </div>
            
            <div className={styles.profileForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>ชื่อ-นามสกุล</label>
                  <div className={styles.readOnlyInput}>{userData.name}</div>
                </div>
                <div className={styles.formGroup}>
                  <label>ชื่อผู้ใช้</label>
                  <div className={styles.readOnlyInput}>{userData.username}</div>
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>เบอร์โทรศัพท์</label>
                  <div className={styles.readOnlyInput}>{userData.phone}</div>
                </div>
              </div>
              
              <div className={styles.formSection}>
                <div className={styles.email}>อีเมลของฉัน</div>
                <div className={styles.emailList}>
                  <div className={styles.emailItem}>
                    <div className={styles.emailIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#3b82f6">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div className={styles.emailText}>{userData.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccountSetting;