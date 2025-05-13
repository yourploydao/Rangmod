import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import styles from "../styles/user-account-setting.module.css";
import SidebarUser from '@/components/sidebar-setting-user';

const UserAccountSetting = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  
  // Mock user data - in a real app this would come from a database or context
  const [userData, setUserData] = useState({
    fullName: 'Tinny Targarian',
    username: 'Tinny',
    phoneNumber: '0902301234',
    email: 'tinny@gmail.com',
    role: 'User',
    profileImage: '/assets/user1.jpeg'
  });

  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleEditButtonClick = () => {
    // Redirect to edit-user-setting page when Edit button is clicked
    router.push("/user-edit-setting");
  };
  
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleLogout = () => {
    // In a real app, this would clear auth state and redirect
    alert("Logging out...");
    router.push("/login");
  };

  const handleRequestPermission = () => {
    // Redirect to owner permission page
    router.push("/owner-permission");
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

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Use the imported Sidebar component */}
        <SidebarUser />
        
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.greeting}>
              <h1>Hello, {userData.username}</h1>
              <p>Have a nice day</p>
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
                        <span>Logout</span>
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
                </div>
                <div className={styles.profileInfo}>
                  <h2 className={styles.profileName}>{userData.fullName}</h2>
                  <p className={styles.profileEmail}>{userData.email}</p>
                </div>
              </div>
              <div className={styles.profileHeaderRight}>
                <button 
                  className={styles.editButton} 
                  onClick={handleEditButtonClick}
                >
                  Edit
                </button>
              </div>
            </div>
            
            <div className={styles.profileForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <div className={styles.readOnlyInput}>{userData.fullName}</div>
                </div>
                <div className={styles.formGroup}>
                  <label>Username</label>
                  <div className={styles.readOnlyInput}>{userData.username}</div>
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <div className={styles.readOnlyInput}>{userData.phoneNumber}</div>
                </div>
              </div>
              
              <div className={styles.formSection}>
                <div className={styles.email}>My email Address</div>
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

              <div className={styles.requestPermissionContainer}>
                <button 
                  className={styles.requestPermissionButton} 
                  onClick={handleRequestPermission}
                >
                  request permission to create a dormitory
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccountSetting;