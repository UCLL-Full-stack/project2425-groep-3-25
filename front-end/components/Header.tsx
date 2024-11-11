import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import LoginPopUp from "@/components/LoginPopUp";

const Header: React.FC = () => {
  const [isLoginPopUpOpen, setIsLoginPopUpOpen] = useState(false);

  const handleOpenLoginPopUp = () => {
    setIsLoginPopUpOpen(true);
  };

  const handleCloseLoginPopUp = () => {
    setIsLoginPopUpOpen(false);
  };

  const handleLogin = (username: string, password: string) => {
    console.log("Logging in with", username, password);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo}>ProjectShowcase</h1>
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
              <Link href="/myCompany">My Company</Link>
            </li>
            <li>
              <Link href="/employees">Employees</Link>
            </li>
          </ul>
        </nav>
        <button className={styles.contactButton} onClick={handleOpenLoginPopUp}>
          Log in
        </button>
      </div>

      <LoginPopUp
        isOpen={isLoginPopUpOpen}
        onClose={handleCloseLoginPopUp}
        onLogin={handleLogin}
        title="Inloggen"
        description="Vul uw gegevens in om in te loggen."
      />
    </header>
  );
};

export default Header;
