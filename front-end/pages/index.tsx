// Importing necessary components and modules
import React from "react";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import styles from "../styles/Home.module.css";

// Main App Component
const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>ProjectShowcase</title>
        <meta
          name="description"
          content="A showcase of various projects by our talented community"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.app}>
        <Header />

        <main className={styles.main}>
          <section className={styles.heroSection}>
            <h1 className={styles.heroTitle}>Welcome to Project Showcase</h1>
            <p className={styles.heroSubtitle}>
              Discover the projects and partners we collaborate with to bring
              innovation to life.
            </p>
            <button className={styles.heroButton}>Get Started</button>
          </section>
          <section className={styles.summary}>
            <h1 className={styles.title}>Our Partner Companies:</h1>
          </section>

          <div className={styles.grid}>
            <a className={styles.card}>
              <h2>Company A &rarr;</h2>
              <p></p>
            </a>

            <a className={styles.card}>
              <h2>Company B &rarr;</h2>
              <p></p>
            </a>

            <a className={styles.card}>
              <h2>Company C &rarr;</h2>
              <p></p>
            </a>

            <a className={styles.card}>
              <h2>Company D &rarr;</h2>
              <p></p>
            </a>
          </div>

          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <p>&copy; 2024 Brand, Inc. - Privacy - Terms - Sitemap</p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default HomePage;
