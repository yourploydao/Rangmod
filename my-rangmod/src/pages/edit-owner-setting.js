import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import styles from "../styles/owner-account-setting.module.css";
// import Header from "../components/navigation";
// import Footer from "../components/footer";

const OwnerAccountSetting = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  
  // Mock user data - in a real app this would come from a database or context
  const [userData, setUserData] = useState({
    fullName: 'Benny Targarian',
    username: 'Benny',
    phoneNumber: '0880001234',
    email: 'Benny@gmail.com',
    role: 'Dorm Owner'
  });

  const [emails, setEmails] = useState(['Benny@gmail.com']);
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  // Add state for dropdown menu
  const [showDropdown, setShowDropdown] = useState(false);

  const handleEditClick = () => {
    router.push("/owner-account-setting");
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
    }
  };
  
  const handleRemoveEmail = (emailToRemove) => {
    if (emails.length > 1) {
      setEmails(emails.filter(email => email !== emailToRemove));
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleResetPassword = () => {
    // In a real app, this would validate and submit to an API
    if (passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword) {
      alert("Password updated successfully");
      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordReset(false);
    } else {
      alert("Passwords don't match or are empty");
    }
  };
  
  // Add logout handler
  const handleLogout = () => {
    // In a real app, this would clear auth state and redirect
    alert("Logging out...");
    router.push("/login");
  };
  
  // Toggle dropdown visibility
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
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
        <div className={styles.sidebar}>
          <div className={styles.logoContainer}>
            <img src="/assets/rangmodlogo.png" alt="RangMod" className={styles.logo} />
            <span className={styles.logoText}>RANGMOD</span>
          </div>
          
          <nav className={styles.sidebarNav}>
            <ul className={styles.navList}>
              {/* Order changed: Setting now above Edit */}
              <li className={`${styles.navItem} ${styles.active}`}>
                <div className={styles.navIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                  </svg>
                </div>
                <span>Setting</span>
              </li>
              <li className={styles.navItem} onClick={handleEditClick}>
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
                  onClick={handleEditClick}
                >
                  Save
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
                <div className={styles.formGroup}>
                  {/* Empty form group for layout purposes */}
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <div className={styles.formSection}>
                    <h3>My email Address</h3>
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
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#ef4444">
                                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
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
                    <h3>Reset Password</h3>
                    <div className={styles.formGroup}>
                      <label>New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={styles.editableInput}
                        // placeholder="••••••••"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={styles.editableInput}
                        // placeholder="••••••••"
                      />
                    </div>
                    <button 
                      className={styles.resetPasswordButton} 
                      onClick={handleResetPassword}
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
  );
};

export default OwnerAccountSetting;