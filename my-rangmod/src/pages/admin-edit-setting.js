import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import styles from "../styles/admin-account-setting.module.css";
import SidebarAdmin from '@/components/sidebar-setting-admin';

const AdminAccountSettingEdit = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  
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
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleShowNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!userData.name || !userData.username) {
        handleShowNotification('Name and username are required', 'error');
        return;
      }

      // Call API to update profile
      const response = await axios.put('/api/auth/me', {
        name: userData.name,
        username: userData.username,
        phone: userData.phone,
      });

      if (response.status === 200) {
        handleShowNotification("Changes saved successfully");
        setTimeout(() => {
          router.push("/admin-account-setting");
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      handleShowNotification(
        error.response?.data?.message || "Failed to save changes",
        "error"
      );
    } finally {
      setIsSaving(false);
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
      console.error('Logout error:', err);
      handleShowNotification("Failed to logout. Please try again.", "error");
    }
  };
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          handleShowNotification('Please select an image file', 'error');
          return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          handleShowNotification('Image size must be less than 5MB', 'error');
          return;
        }

        // Convert file to base64
        const reader = new FileReader();
        const base64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        // Upload to Cloudinary using existing /api/upload endpoint
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64 }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const result = await response.json();
        
        // Update user's profile picture
        const updateResponse = await axios.put('/api/auth/me', {
          name: userData.name,
          username: userData.username,
          phone: userData.phone,
          profile_picture: result.url
        });

        if (updateResponse.status === 200) {
          setUserData({
            ...userData,
            profile_picture: result.url
          });
          handleShowNotification("Profile picture updated successfully");
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        handleShowNotification(
          err.response?.data?.message || "Failed to update profile picture",
          "error"
        );
      }
    }
  };
  
  const handleImageUploadClick = () => {
    fileInputRef.current.click();
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
        <div className={styles.loading}>Loading...</div>
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
              <h1>Hello, {userData.username}</h1>
              <p>Have a nice day</p>
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
                  <img 
                    src={userData.profile_picture} 
                    alt="Profile Avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png';
                    }}
                  />
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
                  <h2 className={styles.profileName}>{userData.name}</h2>
                  <p className={styles.profileEmail}>{userData.email}</p>
                </div>
              </div>
              <div className={styles.profileHeaderRight}>
                <button 
                  className={`${styles.editButton} ${isSaving ? styles.disabledButton : ''}`}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            
            <div className={styles.profileForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleUserDataChange}
                    className={styles.editableInput}
                    disabled={isSaving}
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
                    disabled={isSaving}
                  />
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleUserDataChange}
                    className={styles.editableInput}
                    disabled={isSaving}
                  />
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
            </div>
          </div>
        </div>
      </div>
      
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

export default AdminAccountSettingEdit;