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
      key: 'dashboard',
      icon: "https://cdn-icons-png.flaticon.com/128/2948/2948025.png",
      text: "Dashboard",
      path: "/admin/dashboard"
    },
    {
      key: 'users',
      icon: "https://cdn-icons-png.flaticon.com/128/511/511587.png",
      text: "Users",
      path: "/admin/user"
    },
    {
      key: 'settings',
      icon: "https://cdn-icons-png.flaticon.com/128/503/503822.png",
      text: "Setting",
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
        <Link href="/homepage">
          <div className={styles.logoContainer}>
            <img src="/assets/rangmodlogo.png" alt="RangMod Logo" className={styles.logo} />
            <span className={styles.logoText}>RANGMOD</span>
          </div>
        </Link>
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