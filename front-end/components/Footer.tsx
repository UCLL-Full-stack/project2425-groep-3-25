import React from "react";
import styles from "../styles/Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; 2024 ProjectShowcase, Inc. - Privacy - Terms - Sitemap</p>
      </div>
    </footer>
  );
};

export default Footer;
