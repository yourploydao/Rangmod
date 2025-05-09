import React from 'react';
import { Home, Users, FileText, Settings, Mail } from 'lucide-react';
import styles from "../styles/sidebar-setting.module.css";


const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          <img src="/assets/rangmodlogo.png" alt="RangMod Logo" className={styles.logo} />
          <span className={styles.logoText}>RANGMOD</span>
        </div>
      </div>
      <nav className={styles.sidebarNav}>
        <ul className={styles.navList}>
          <li className={`${styles.navItem} ${styles.active}`}>
            <Home size={18} className={styles.navIcon} />
            Dashboard
          </li>
          <li className={styles.navItem}>
            <Users size={18} className={styles.navIcon} />
            Users
          </li>
          <li className={styles.navItem}>
            <FileText size={18} className={styles.navIcon} />
            Owner Permissions
          </li>
          <li className={styles.navItem}>
            <Settings size={18} className={styles.navIcon} />
            Setting
          </li>
          <li className={styles.navItem}>
            <Mail size={18} className={styles.navIcon} />
            Edit
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;