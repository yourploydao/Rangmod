'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';

const menuItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Users', href: '/users' },
  { label: 'Owner Permissions', href: '/ownerpermiss' },
  { label: 'Setting', href: '/setting' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles['sidebar-logo']}>
        <img src="/favicon.ico" alt="RANGMOD Logo" style={{ height: '30px', marginRight: '10px' }} />
        <span>
          <span style={{ color: '#008CFF' }}>RANG</span>
          <span style={{ color: '#152C5B' }}>MOD</span>
        </span>
      </div>

      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link href={item.href} className={`${styles.menuItem} ${isActive ? styles.active : ''}`}>
                  <img src="/favicon.ico" alt="" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
