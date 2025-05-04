import React from "react";
import styles from "../styles/footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.followUs}>
          <p>Follow us!</p>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" className={styles.socialIcon}>
              <img src="https://cdn-icons-png.flaticon.com/128/5968/5968764.png" alt="Facebook" />
            </a>
            <a href="https://instagram.com" className={styles.socialIcon}>
              <img src="https://cdn-icons-png.flaticon.com/128/3955/3955024.png" alt="Instagram" />
            </a>
            <a href="https://line.me" className={styles.socialIcon}>
              <img src="https://cdn-icons-png.flaticon.com/128/3670/3670089.png" alt="Line" />
            </a>
            <a href="https://twitter.com" className={styles.socialIcon}>
              <img src="https://cdn-icons-png.flaticon.com/128/5969/5969020.png" alt="Twitter" />
            </a>
            <a href="https://threads.net" className={styles.socialIcon}>
              <img src="https://cdn-icons-png.flaticon.com/128/12105/12105338.png" alt="Threads" />
            </a>
          </div>
        </div>
        
        <div className={styles.footerLinks}>
          <a href="/academic-housing" className={styles.footerLink}>Academic Housing Alliance</a>
          <a href="/pricing" className={styles.footerLink}>Pricing</a>
          <a href="/features" className={styles.footerLink}>Features</a>
          <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
          <a href="/term" className={styles.footerLink}>Term of Service</a>
        </div>
        
        <div className={styles.copyright}>
          <p>© 2025 All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;