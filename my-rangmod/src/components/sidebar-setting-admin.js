import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from "../styles/sidebar-setting.module.css";

const SidebarAdmin = () => {
  const router = useRouter();
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    // Get the current path from router
    setActivePath(router.pathname);
  }, [router.pathname]);

  const menuItems = [
    {
      key: 'ศูนย์ข้อมูล',
      icon: "https://cdn-icons-png.flaticon.com/128/2948/2948025.png",
      text: "ศูนย์ข้อมูล",
      path: "/admin/dashboard"
    },
    {
      key: 'ผู้ใช้งาน',
      icon: "https://cdn-icons-png.flaticon.com/128/511/511587.png",
      text: "ผู้ใช้งาน",
      path: "/admin/user"
    },
    {
      key: 'ตั้งค่า',
      icon: "https://cdn-icons-png.flaticon.com/128/503/503822.png",
      text: "ตั้งค่า",
      path: "/admin/account-setting"
    }
  ];

  const handleItemClick = (path) => {
    router.push(path);
  };

  const isActive = (path) => {
    // Special handling for settings pages
    if (path === '/admin/account-setting') {
      return activePath.includes('admin/account-setting') || activePath.includes('admin/edit-setting');
    }
    // For all other menu items, do exact path matching
    return activePath === path;
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <a href="/homepage" style={{ textDecoration: 'none' }}>
          <div className={styles.logoContainer}>
            <img src="/assets/rangmodlogo.png" alt="RangMod Logo" className={styles.logo} />
            <span className={styles.logoText} style={{ textDecoration: 'none' }}>RANGMOD</span>
          </div>
        </a>
      </div>
      <nav className={styles.sidebarNav}>
        <ul className={styles.navList}>
          {menuItems.map((item) => (
            <li 
              key={item.key}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => handleItemClick(item.path)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.iconContainer}>
                <img 
                  src={item.icon}
                  alt={`${item.text} Icon`}
                  className={styles.navIcon} 
                />
              </div>
              <span className={styles.navText}>{item.text}</span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarAdmin;