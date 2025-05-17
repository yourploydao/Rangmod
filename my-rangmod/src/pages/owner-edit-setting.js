import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import styles from "../styles/owner-account-setting.module.css";
import SidebarOwner from '@/components/sidebar-setting-owner';

const OwnerAccountSettingEdit = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Mock user data - in a real app this would come from a database or context
  const [userData, setUserData] = useState({
    fullName: 'Benny Targarian',
    username: 'Benny',
    phoneNumber: '0880001234',
    email: 'Benny@gmail.com',
    profileImage: '/assets/owner1.jpeg'
  });

  // Add state for dropdown menu
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Add states for notification popup
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success'); // 'success', 'error', 'warning'

  const handleShowNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    // Auto hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleEditClick = () => {
    // In a real app, this would save changes to the API
    handleShowNotification("บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว");
    
    // Set a short delay before redirecting to ensure user sees the notification
    setTimeout(() => {
      router.push("/owner-account-setting");
    }, 1500);
  };
  
  // Add logout handler
  const handleLogout = () => {
    // In a real app, this would clear auth state and redirect
    handleShowNotification("กำลังออกจากระบบ...");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };
  
  // Toggle dropdown visibility
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  
  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // Here, we're just creating a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setUserData({
        ...userData,
        profileImage: imageUrl
      });
      handleShowNotification("รูปโปรไฟล์ได้รับการอัปเดตเรียบร้อยแล้ว");
    }
  };
  
  const handleImageUploadClick = () => {
    // Trigger the hidden file input
    fileInputRef.current.click();
  };
  
  // Close dropdown when clicking outside
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

  // Close notification when ESC key is pressed
  useEffect(() => {
    function handleEscKey(event) {
      if (event.keyCode === 27) {
        setShowNotification(false);
      }
    }
    
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Use the imported Sidebar component */}
        <SidebarOwner />
        
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.greeting}>
              <h1>สวัสดี, {userData.username}</h1>
              <p>ขอให้มีวันที่ดีนะ!</p>
            </div>
            
            <div className={styles.headerRightSection}>
              <div className={styles.userInfo}>
                <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
                  <img src={userData.profileImage} alt="Profile" className={styles.profileImage} />
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
                  <img src={userData.profileImage} alt="Profile Avatar" />
                  <div className={styles.profileImageUpload} onClick={handleImageUploadClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className={styles.imageInput} 
                    accept="image/*" 
                    onChange={handleImageChange} 
                  />
                </div>
                <div className={styles.profileInfo}>
                  <h2 className={styles.profileName}>{userData.fullName}</h2>
                  <p className={styles.profileEmail}>{userData.email}</p>
                </div>
              </div>
              <div className={styles.profileHeaderRight}>
                <button 
                  className={styles.editButton}
                  onClick={handleEditClick}
                >
                  บันทึก
                </button>
              </div>
            </div>
            
            <div className={styles.profileForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleUserDataChange}
                    className={styles.editableInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleUserDataChange}
                    className={styles.editableInput}
                  />
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleUserDataChange}
                    className={styles.editableInput}
                  />
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
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
          
          {/* Enhanced Notification Popup */}
          {showNotification && (
            <div className={`${styles.notification} ${styles[notificationType]} ${styles.topRight}`}>
              <div className={styles.notificationContent}>
                <div className={styles.notificationIcon}>
                  {notificationType === 'success' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  )}
                  {notificationType === 'error' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  )}
                  {notificationType === 'warning' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  )}
                </div>
                <div className={styles.notificationMessage}>
                  {notificationMessage}
                </div>
                <button 
                  className={styles.notificationClose} 
                  onClick={() => setShowNotification(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className={styles.notificationProgress}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerAccountSettingEdit;