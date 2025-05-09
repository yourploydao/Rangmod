import React, { useState } from 'react';
import { useRouter } from "next/router";
import styles from "../styles/owner-account-setting.module.css";
// import Header from "../components/navigation";
// import Footer from "../components/footer";

const OwnerAccountSetting = () => {
  // Mock user data - in a real app this would come from a database or context
  const [userData, setUserData] = useState({
    fullName: 'Benny Targarian',
    username: 'Benny',
    phoneNumber: '0880001234',
    email: 'Benny@gmail.com',
    role: 'Dorm Owner'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...userData});
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = React.useRef(null);
  
  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({...userData});
  };
  
  const handleSaveClick = () => {
    setUserData({...formData});
    setIsEditing(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const router = useRouter();
  
  const handleEditButtonClick = () => {
    router.push("/edit-owner-setting");
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleLogout = () => {
    // Logout logic would go here
    console.log("Logging out...");
    // Typically would redirect to login page or clear session
    router.push("/login");
  };
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSignOut = () => {
    // Sign out logic would go here
    console.log("Signing out...");
    // Typically would redirect to login page or clear session
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.logoContainer}>
            <img src="/assets/rangmodlogo.png" alt="RangMod" className={styles.logo} />
            <span className={styles.logoText}>RANGMOD</span>
          </div>
          
          <nav className={styles.sidebarNav}>
            <ul className={styles.navList}>
              {/* Reversed order: Setting first, then Edit */}
              <li className={`${styles.navItem} ${styles.active}`}>
                <div className={styles.navIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                  </svg>
                </div>
                <span>Setting</span>
              </li>
              <li className={styles.navItem}>
                <div className={styles.navIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </div>
                <span>Edit</span>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.greeting}>
              <h1>Hello, {userData.username}</h1>
              <p>Have a nice day</p>
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
                <img src="/assets/owner1.jpeg" alt="User Avatar" className={styles.profileImage} />
                <span className={styles.profileName}>{userData.username}</span>
                <img 
                  src="https://cdn-icons-png.flaticon.com/128/152/152415.png" 
                  alt="dropdown" 
                  className={styles.dropdownArrow} 
                />
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
          
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.profileHeaderLeft}>
                <div className={styles.profileAvatar}>
                  <img src="/assets/owner1.jpeg" alt="Profile Avatar" />
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
                  <input 
                    type="text" 
                    name="fullName" 
                    value={userData.fullName} 
                    readOnly
                    className={styles.readOnlyInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Username</label>
                  <input 
                    type="text" 
                    name="username" 
                    value={userData.username} 
                    readOnly
                    className={styles.readOnlyInput}
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
                    readOnly
                    className={styles.readOnlyInput}
                  />
                </div>
              </div>
              
              <div className={styles.formSection}>
                <h3>My email Address</h3>
                <div className={styles.emailList}>
                  <div className={styles.emailItem}>
                    <div className={styles.emailIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#3b82f6">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <span>{userData.email}</span>
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

export default OwnerAccountSetting;