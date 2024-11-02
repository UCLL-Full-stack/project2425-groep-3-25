// pages/index.tsx

import React, { useState } from "react";
import Head from "next/head";
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
            <h1 className={styles.heroTitle}>Welcome to ProjectShowcase</h1>
          </section>

          <section className={styles.infoSection}>
            <h2 className={styles.infoTitle}>
              What Does ProjectShowcase Offer?
            </h2>
            <p className={styles.infoText}>
              With ProjectShowcase, companies can showcase and manage their
              completed projects across various categories. Visitors can easily
              browse through these projects and select specific companies to
              learn more about their achievements and expertise. This provides a
              quick and insightful look into the innovative and valuable
              contributions of each company in their respective industries.
            </p>

            <h2 className={styles.infoTitle}>For Employees</h2>
            <p className={styles.infoText}>
              Employees have a unique opportunity to see and share their
              contributions to projects. ProjectShowcase makes it visible which
              projects employees have supported, highlighting not only their
              individual achievements but also the teamwork within the company.
            </p>

            <h2 className={styles.infoTitle}>Our Mission</h2>
            <p className={styles.infoText}>
              ProjectShowcase is designed to help companies and their teams
              manage and showcase their successes. By organizing projects into
              categories, we ensure that achievements are displayed in a
              structured way, allowing companies to tell their story clearly and
              convincingly to clients, partners, and potential employees.
            </p>
          </section>

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
