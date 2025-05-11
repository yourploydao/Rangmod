import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import styles from "../styles/user-account-setting.module.css";
import SidebarUser from '@/components/sidebar-setting-user';

const OwnerAccountSetting = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Mock user data - in a real app this would come from a database or context
  const [userData, setUserData] = useState({
    fullName: 'Tinny Targarian',
    username: 'Tinny',
    phoneNumber: '0880001234',
    email: 'Tinny@gmail.com',
    profileImage: '/assets/user1.jpeg'
  });

  const [emails, setEmails] = useState(['Tinny@gmail.com']);
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  // Add state for dropdown menu and password visibility
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Add states for notification popup
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success'); // 'success', 'error', 'warning'
  
  // Add state to track if passwords match
  const [passwordsMatch, setPasswordsMatch] = useState(true);

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
    // Check if there are any password fields filled but not matching
    if ((passwordData.newPassword || passwordData.confirmPassword) && 
        passwordData.newPassword !== passwordData.confirmPassword) {
      handleShowNotification("Passwords don't match. Please correct before saving.", "error");
      return;
    }
    
    // In a real app, this would save changes to the API
    handleShowNotification("Changes saved successfully");
    
    // Set a short delay before redirecting to ensure user sees the notification
    setTimeout(() => {
      router.push("/user-account-setting");
    }, 1500);
  };
  
  const handleAddEmailClick = () => {
    setShowAddEmail(true);
  };
  
  const handleCancelAddEmail = () => {
    setShowAddEmail(false);
    setNewEmail('');
  };
  
  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail('');
      setShowAddEmail(false);
      handleShowNotification("Email added successfully");
    } else if (emails.includes(newEmail)) {
      handleShowNotification("This email already exists", "error");
    } else {
      handleShowNotification("Please enter a valid email", "error");
    }
  };
  
  const handleRemoveEmail = (emailToRemove) => {
    if (emails.length > 1) {
      setEmails(emails.filter(email => email !== emailToRemove));
      handleShowNotification("Email removed successfully");
    } else {
      handleShowNotification("You must have at least one email address", "warning");
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const updatedPasswordData = {
      ...passwordData,
      [name]: value
    };
    
    setPasswordData(updatedPasswordData);
    
    // Check if passwords match whenever either password field changes
    if (updatedPasswordData.newPassword || updatedPasswordData.confirmPassword) {
      setPasswordsMatch(
        updatedPasswordData.newPassword === updatedPasswordData.confirmPassword
      );
    } else {
      // If both fields are empty, consider them matching
      setPasswordsMatch(true);
    }
  };
  
  const handleResetPassword = () => {
    // In a real app, this would validate and submit to an API
    if (!passwordData.newPassword) {
      handleShowNotification("Password cannot be empty", "error");
      return;
    } 
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      handleShowNotification("Passwords don't match", "error");
      return;
    }
    
    handleShowNotification("Password updated successfully");
    setPasswordData({
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  // Add logout handler
  const handleLogout = () => {
    // In a real app, this would clear auth state and redirect
    handleShowNotification("Logging out...");
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
      handleShowNotification("Profile image updated");
    }
  };
  
  const handleImageUploadClick = () => {
    // Trigger the hidden file input
    fileInputRef.current.click();
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                  className={`${styles.editButton} ${!passwordsMatch ? styles.disabledButton : ''}`} 
                  onClick={handleEditClick}
                  disabled={!passwordsMatch}
                >
                  Save
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
                    <h3 className={styles.sectionTitle}>My email Address</h3>
                    <div className={styles.emailList}>
                      {emails.map((email, index) => (
                        <div className={styles.emailItem} key={index}>
                          <div className={styles.emailIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#3b82f6">
                              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                          </div>
                          <div className={styles.emailText}>{email}</div>
                          {emails.length > 1 && (
                            <div className={styles.emailActions}>
                              <button className={styles.deleteButton} onClick={() => handleRemoveEmail(email)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2">
                                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {showAddEmail ? (
                      <div className={styles.newEmailForm}>
                        <div className={styles.formGroup}>
                          <label>New Email Address</label>
                          <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className={styles.editableInput}
                            placeholder="Enter new email address"
                          />
                        </div>
                        <div className={styles.newEmailActions}>
                          <button className={styles.cancelEmailButton} onClick={handleCancelAddEmail}>
                            Cancel
                          </button>
                          <button className={styles.addButton} onClick={handleAddEmail}>
                            Add Email
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button className={styles.addEmailButton} onClick={handleAddEmailClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="#3b82f6">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                        Add Email Address
                      </button>
                    )}
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <div className={styles.passwordSection}>
                    <h3 className={styles.sectionTitle}>Reset Password</h3>
                    <div className={styles.passwordBox}>
                      <div className={styles.passwordInputWrapper}>
                        <label>New Password</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={`${styles.editableInput} ${!passwordsMatch && passwordData.newPassword ? styles.inputError : ''}`}
                          placeholder="Enter new password"
                        />
                        <div 
                          className={styles.passwordToggleIcon}
                          onClick={togglePasswordVisibility}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {showPassword ? (
                              <>
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                              </>
                            ) : (
                              <>
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </>
                            )}
                          </svg>
                        </div>
                      </div>
                      <div className={styles.passwordInputWrapper}>
                        <label>Confirm Password</label>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`${styles.editableInput} ${!passwordsMatch && passwordData.confirmPassword ? styles.inputError : ''}`}
                          placeholder="Confirm your password"
                        />
                        <div 
                          className={styles.passwordToggleIcon}
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {showConfirmPassword ? (
                              <>
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                              </>
                            ) : (
                              <>
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </>
                            )}
                          </svg>
                        </div>
                      </div>
                      {!passwordsMatch && passwordData.confirmPassword && (
                        <div className={styles.passwordError}>
                          Passwords don't match
                        </div>
                      )}
                      <button 
                        className={`${styles.resetPasswordButton} ${!passwordsMatch ? styles.disabledButton : ''}`} 
                        onClick={handleResetPassword}
                        disabled={!passwordsMatch}
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Notification Popup - Moved to top right */}
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
  );
};

export default OwnerAccountSetting;