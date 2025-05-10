import React from 'react';
import Link from 'next/link'; // Import Link for navigation
import styles from "../styles/sidebar-setting.module.css";

const SidebarAdmin = () => {
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
          <li className={`${styles.navItem} ${styles.active}`}>
            <div className={styles.iconContainer}>
              <img 
                src="https://cdn-icons-png.flaticon.com/128/2948/2948025.png" 
                alt="Dashboard Icon" 
                className={styles.navIcon} 
              />
            </div>
            <span className={styles.navText}>Dashboard</span>
          </li>
          <li className={styles.navItem}>
            <div className={styles.iconContainer}>
              <img 
                src="https://cdn-icons-png.flaticon.com/128/511/511587.png" 
                alt="Users Icon" 
                className={styles.navIcon} 
              />
            </div>
            <span className={styles.navText}>Users</span>
          </li>
          <li className={styles.navItem}>
            <div className={styles.iconContainer}>
              <img 
                src="https://cdn-icons-png.flaticon.com/128/4757/4757254.png" 
                alt="Owner Permissions Icon" 
                className={styles.navIcon} 
              />
            </div>
            <span className={styles.navText}>Owner Permissions</span>
          </li>
          <li className={styles.navItem}>
            <div className={styles.iconContainer}>
              <img 
                src="https://cdn-icons-png.flaticon.com/128/503/503822.png" 
                alt="Settings Icon" 
                className={styles.navIcon} 
              />
            </div>
            <span className={styles.navText}>Setting</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarAdmin;