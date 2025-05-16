// components/Navigation.js
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/navigation.module.css";
import { useRouter } from 'next/router';
import axios from 'axios';

const Navigation = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    username: '',
    profileImage: 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
  });
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.status === 200) {
          setIsLoggedIn(true);
          setUserData({
            username: response.data.username,
            profileImage: response.data.profile_picture || 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png',
            role: response.data.role
          });
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogoClick = () => {
    router.push('/homepage');
  };

  const handleMyAccountClick = () => {
    if (userData.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (userData.role === 'owner') {
      router.push('/owner-dashboard');
    } else {
      router.push('/user-account-setting');
    }
    setShowDropdown(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserData({
        username: '',
        profileImage: 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
      });
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setShowDropdown(false);
  };

  const handleSignIn = () => {
    router.push('/signin');
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
              href="/homepage" 
              className={`${styles.navLink} ${isActive('/homepage') ? styles.activeLink : ''}`}
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
              href="/chatbot" 
              className={`${styles.navLink} ${isActive('/chatbot') ? styles.activeLink : ''}`}
            >
              Chatbot
            </a>
          </nav>
          
          {!isLoading && (
            <>
              {isLoggedIn ? (
                <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
                  <img 
                    src={userData.profileImage} 
                    alt={userData.username} 
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
                      <div className={styles.dropdownItem} onClick={handleMyAccountClick}>
                        <div className={styles.dropdownIcon}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <span>My account</span>
                      </div>
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
              ) : (
                <button className={styles.signInButton} onClick={handleSignIn}>
                  Sign In
                </button>
              )}
            </>
          )}
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
              href="/chatbot" 
              className={`${styles.mobileNavLink} ${isActive('/chatbot') ? styles.activeLink : ''}`}
            >
              Chatbot
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;