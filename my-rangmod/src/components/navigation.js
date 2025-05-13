// components/Navigation.js
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/navigation.module.css";
import { useRouter } from 'next/router';

const Navigation = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const router = useRouter();

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogoClick = () => {
    // Navigate to home page
    window.location.href = '/homepage-before-login';
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return router.pathname === path;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest(`.${styles.hamburgerMenu}`)) {
        setIsMobileMenuOpen(false);
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
        <div className={styles.leftSection}>
          <div className={styles.logo} onClick={handleLogoClick}>
            <img src="/assets/rangmodlogo.png" alt="RANGMOD" className={styles.logoImage} />
            <span className={styles.logoText}>RANGMOD</span>
          </div>
        </div>
        
        <div className={styles.rightSection}>
          {/* Desktop Navigation */}
          <nav className={styles.navigation}>
            <a 
              href="/homepage-before-login" 
              className={`${styles.navLink} ${isActive('/homepage-before-login') ? styles.activeLink : ''}`}
            >
              Home
            </a>
            <a 
              href="/result-after-search" 
              className={`${styles.navLink} ${isActive('/result-after-search') ? styles.activeLink : ''}`}
            >
              Search
            </a>
            <a 
              href="/about" 
              className={`${styles.navLink} ${isActive('/about') ? styles.activeLink : ''}`}
            >
              About
            </a>
            <a 
              href="/contact" 
              className={`${styles.navLink} ${isActive('/contact') ? styles.activeLink : ''}`}
            >
              Contact
            </a>
          </nav>
          
          <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
            <img src="/assets/user1.jpeg" alt="tinny" className={styles.profileImage} />
            <span className={styles.profileName}>tinny</span>
            <img 
              src="https://cdn-icons-png.flaticon.com/128/152/152415.png" 
              alt="dropdown" 
              className={styles.dropdownArrow} 
            />
          </div>
        </div>
        
        {/* Hamburger Menu Button */}
        <div className={styles.hamburgerMenu} onClick={toggleMobileMenu}>
          <img 
            src="https://cdn-icons-png.flaticon.com/128/13958/13958298.png" 
            alt="Menu" 
            className={styles.hamburgerIcon} 
          />
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={styles.mobileNavigation} ref={mobileMenuRef}>
            <a 
              href="/homepage-after-login" 
              className={`${styles.mobileNavLink} ${isActive('/homepage-after-login') ? styles.activeLink : ''}`}
            >
              Home
            </a>
            <a 
              href="/search" 
              className={`${styles.mobileNavLink} ${isActive('/search') ? styles.activeLink : ''}`}
            >
              Search
            </a>
            <a 
              href="/about" 
              className={`${styles.mobileNavLink} ${isActive('/about') ? styles.activeLink : ''}`}
            >
              About
            </a>
            <a 
              href="/contact" 
              className={`${styles.mobileNavLink} ${isActive('/contact') ? styles.activeLink : ''}`}
            >
              Contact
            </a>
          </div>
        )}
        
        {/* Profile Dropdown */}
        {showDropdown && (
          <div className={styles.profileDropdown}>
            <div className={styles.profileHeader}>
              <img src="/assets/user1.jpeg" alt="User Profile" className={styles.dropdownProfileImage} />
              <div className={styles.profileInfo}>
                <h3 className={styles.profileFullName}>tinny</h3>
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