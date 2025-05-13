import React, { useEffect, useState } from 'react';
import styles from "../styles/sidebar-setting.module.css";

const SidebarUser = () => {
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    // Get the current path from window.location
    const path = window.location.pathname;
    setActivePath(path);
  }, []);

  // Function to check if a menu item is active
  const isActive = (path) => {
    return activePath === path;
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <a href="/homepage-after-login">
          <div className={styles.logoContainer}>
            <img src="/assets/rangmodlogo.png" alt="RangMod Logo" className={styles.logo} />
            <span className={styles.logoText}>RANGMOD</span>
          </div>
        </a>
      </div>
      <nav className={styles.sidebarNav}>
        <ul className={styles.navList}>
          <li className={`${styles.navItem} ${isActive('/user-account-setting') ? styles.active : ''}`}>
            <a href="/user-account-setting" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', width: '100%' }}>
              <div className={styles.iconContainer}>
                <img 
                  src="https://cdn-icons-png.flaticon.com/128/503/503822.png" 
                  alt="Settings Icon"
                  className={styles.navIcon} 
                />
              </div>
              <span className={styles.navText}>Setting</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarUser;