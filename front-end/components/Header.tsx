// components/Header.tsx
import React from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1>ProjectShowcase</h1>
        <nav>
          <ul className={styles.navList}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/projects">Projects</Link>
            </li>
            <li>
              <Link href="/companies">Companies</Link>
            </li>
            <li>
              <Link href="/my-company">My Company</Link>
            </li>
            <li>
              <Link href="/people">Employees</Link>
            </li>
          </ul>
        </nav>
        <button className={styles.contactButton}>Log in</button>
      </div>
    </header>
  );
};

export default Header;
