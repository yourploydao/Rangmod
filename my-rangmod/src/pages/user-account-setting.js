import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import styles from "../styles/user-account-setting.module.css";
import SidebarUser from '@/components/sidebar-setting-user';

const UserAccountSetting = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    role: 'User',
    profile_picture: 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [requestStatus, setRequestStatus] = useState(null);
  const [showRequestButton, setShowRequestButton] = useState(true); // เพิ่มการประกาศตัวแปร
  const [showInstructionPopup, setShowInstructionPopup] = useState(false); // เพิ่มการประกาศตัวแปร

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          router.push('/signin');
          return;
        }

        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const user = response.data;
          setUserData({
            name: user.name || user.username,
            username: user.username,
            phone: user.phone || 'Not set',
            email: user.email,
            role: user.role || 'User',
            profile_picture: user.profile_picture || 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
          });
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          router.push('/signin');
          return;
        }
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);
  
  const handleEditButtonClick = () => {
    router.push("/user-edit-setting");
  };
  
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      // Clear any local storage or state
      localStorage.removeItem('token');
      router.push("/signin");
    } catch (err) {
      console.error('Logout error:', err);
      alert('ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง');
    }
  };

  const handleRequestPermission = () => {
    // Show the instruction popup instead of confirming
    setShowInstructionPopup(true);
  };

  const handleGotIt = () => {
    // Close the popup but keep the request button visible
    setShowInstructionPopup(false);
    router.push("/user-account-setting");
  };
  
  const handleCancel = () => {
    // Just close the popup
    setShowInstructionPopup(false);
  };

  const confirmRequestPermission = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        router.push('/signin');
        return;
      }

      const response = await fetch('/api/owner-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ส่งคำขอไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      }

      const data = await response.json();
      setRequestStatus('success');
      setShowConfirmModal(false);
      setNotification({
        show: true,
        message: 'ส่งคำขอของคุณเรียบร้อยแล้ว กรุณารอการอนุมัติจากผู้ดูแลระบบ',
        type: 'success'
      });
    } catch (err) {
      setError(err.message);
      setShowConfirmModal(false);
      setNotification({
        show: true,
        message: err.message || 'ส่งคำขอไม่สำเร็จ กรุณาลองอีกครั้ง',
        type: 'error'
      });
    }
  };

  const cancelRequestPermission = () => {
    setShowConfirmModal(false);
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
        <SidebarUser />
        
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.greeting}>
              <h1>สวัสดี, {userData.username}</h1>
              <p>ขอให้มีวันที่ดีนะ!</p>
            </div>
            
            <div className={styles.headerRightSection}>
              <div className={styles.userInfo}>
                <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
                  <img 
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
                  <img 
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

              {/* Only render the request permission button if showRequestButton is true */}
              {showRequestButton && (
                <div className={styles.requestPermissionContainer}>
                  <button 
                    className={styles.requestPermissionButton} 
                    onClick={handleRequestPermission}
                  >
                    ขอสิทธิ์ในการแก้ไขหอพักของฉัน
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instruction Popup */}
      {showInstructionPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.instructionPopup}>
            <div className={styles.instructionIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className={styles.instructionContent}>
              <h3>จำเป็นต้องยืนยันตัวตน</h3>
              <p>เพื่อยืนยันตัวตน<br></br>กรุณาแนบเอกสารที่แสดงว่าคุณเป็นเจ้าของหอพัก<br></br>
              โดยส่งเอกสารมาที่อีเมล: rangmod@gmail.com</p>
            </div>
            <div className={styles.instructionActions}>
              <button className={styles.gotItButton} onClick={handleGotIt}>เข้าใจแล้ว</button>
              <button className={styles.cancelButton} onClick={handleCancel}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <div className={styles.notificationContent}>
            <svg className={styles.notificationIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{notification.message}</span>
          </div>
          <button 
            className={styles.notificationClose}
            onClick={() => setNotification({ show: false, message: '', type: 'success' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAccountSetting;