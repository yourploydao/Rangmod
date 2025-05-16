import React from 'react';
import styles from "../styles/sidebar-setting.module.css";

const SidebarOwner = ({ activePage }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <a href="/homepage">
          <div className={styles.logoContainer}>
            <img src="/assets/rangmodlogo.png" alt="RangMod Logo" className={styles.logo} />
            <span className={styles.logoText}>RANGMOD</span>
          </div>
        </a>
      </div>
      <nav className={styles.sidebarNav}>
        <ul className={styles.navList}>
          <li className={`${styles.navItem} ${activePage === 'settings' ? styles.active : ''}`}>
            <a href="/owner-account-setting" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', width: '100%' }}>
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
          <li className={`${styles.navItem} ${activePage === 'dashboard' ? styles.active : ''}`}>
            <a href="/owner-dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', width: '100%' }}>
              <div className={styles.iconContainer}>
                <img 
                  src="https://cdn-icons-png.flaticon.com/128/9308/9308015.png" 
                  alt="Edit Icon" 
                  className={styles.navIcon} 
                />
              </div>
              <span className={styles.navText}>Edit</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarOwner;