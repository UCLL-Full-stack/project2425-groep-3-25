// Header Component as a separate file
// components/Header.tsx
import React from "react";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1>ProjectShowcase</h1>
        <nav>
          <ul className={styles.navList}>
            <li>Projects</li>
            <li>Companies</li>
            <li>My Company</li>
            <li>People</li>
          </ul>
        </nav>
        <button className={styles.contactButton}>Log in</button>
      </div>
    </header>
  );
};

export default Header;
