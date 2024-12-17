import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import LoginPopUp from "@/components/LoginPopUp";
import router from 'next/router';
import { isTokenValid } from "@/utils/authUtils";
import { useEffect } from "react";

const Header: React.FC = () => {
  const [isLoginPopUpOpen, setIsLoginPopUpOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    if (isTokenValid()) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    if (!isTokenValid()) {
      alert("Session has expired. Please log in again.");
    }
    sessionStorage.removeItem("token");
    router.push("/login");
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

      {!isLoggedIn && (
      <button onClick={() => router.push("/login")} className={styles["cancel-button"]}>
            login
      </button>
      )}
      
      {isLoggedIn && (
      <button onClick={handleLogout} className={styles["cancel-button"]}>
            logout
      </button>
      )}
    </div>
  </header>
);
};

export default Header;


