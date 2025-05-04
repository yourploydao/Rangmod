// components/Navigation.js
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/navigation.module.css";
import { useRouter } from "next/router";

const Navigation = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogoClick = () => {
    // Navigate to home page
    window.location.href = '/';
  };

  const handleMyAccountClick = () => {
    // Navigate to profile page
    window.location.href = '/profile';
    setShowDropdown(false);
  };

  const handleLogout = () => {
    // Logout logic would go here
    window.location.href = '/login';
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo} onClick={handleLogoClick}>
          <img src="/assets/rangmod-logo.png" alt="RANGMOD" className={styles.logoImage} />
          <span className={styles.logoText}>RANGMOD</span>
        </div>
        
        <div className={styles.navigation}>
          <a href="/homepage-after-login" className={styles.navLink}>Home</a>
          <a href="/search" className={styles.navLink}>Search</a>
          <a href="/about" className={styles.navLink}>About</a>
          <a href="/contact" className={styles.navLink}>Contact</a>
        </div>
        
        <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
          <img src="/assets/user1.jpeg" alt="tinny" className={styles.profileImage} />
          <span className={styles.profileName}>tinny</span>
          <span className={styles.dropdownIcon}>▼</span>
        </div>
        
        {showDropdown && (
          <div className={styles.profileDropdown}>
            <div className={styles.profileHeader}>
              <img src="/assets/user1.jpeg" alt="User Profile" className={styles.dropdownProfileImage} />
              <div className={styles.profileInfo}>
                <h3 className={styles.profileFullName}>tinny</h3>
                <p className={styles.profileStatus}>Online</p>
              </div>
            </div>
            
            <div className={styles.dropdownDivider}></div>
            
            <div className={styles.dropdownItem} onClick={handleMyAccountClick}>
              <div className={styles.dropdownIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span>My account</span>
              <div className={styles.arrowIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </div>
            
            <div className={styles.dropdownDivider}></div>
            
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
    </header>
  );
};

export default Navigation;