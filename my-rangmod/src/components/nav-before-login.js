// components/NavBeforeLogin.js
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/nav-before-login.module.css";
import { useRouter } from 'next/router';

const NavBeforeLogin = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const router = useRouter();

  const handleLogoClick = () => {
    // Navigate to home page
    window.location.href = '/';
  };

  const handleSignInClick = () => {
    // Navigate to login page
    window.location.href = '/signin';
  };

  // Force sign in for all nav items
  const handleNavClick = (e) => {
    e.preventDefault();
    window.location.href = '/signin';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return router.pathname === path;
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
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
        
        <nav className={styles.navigation}>
          <a 
            href="/homepage" 
            className={`${styles.navLink} ${isActive('/homepage') ? styles.activeLink : ''}`}
            onClick={handleNavClick}
          >
            Home
          </a>
          <a 
            href="/search" 
            className={`${styles.navLink} ${isActive('/search') ? styles.activeLink : ''}`}
            onClick={handleNavClick}
          >
            Search
          </a>
          <a 
            href="/chatbot" 
            className={`${styles.navLink} ${isActive('/chatbot') ? styles.activeLink : ''}`}
            onClick={handleNavClick}
          >
            Chat Bot
          </a>
        </nav>
        
        <div className={styles.rightSection}>
          <button className={styles.signInButton} onClick={handleSignInClick}>
            Sign In
          </button>
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
              href="/homepage" 
              className={`${styles.mobileNavLink} ${isActive('/homepage') ? styles.activeLink : ''}`}
              onClick={handleNavClick}
            >
              Home
            </a>
            <a 
              href="/search" 
              className={`${styles.mobileNavLink} ${isActive('/search') ? styles.activeLink : ''}`}
              onClick={handleNavClick}
            >
              Search
            </a>
            <a 
              href="/chatbot" 
              className={`${styles.mobileNavLink} ${isActive('/chatbot') ? styles.activeLink : ''}`}
              onClick={handleNavClick}
            >
              Chat Bot
            </a>
            <a 
              href="/signin" 
              className={`${styles.mobileNavLink} ${styles.mobileSignInLink}`}
            >
              Sign In
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBeforeLogin;