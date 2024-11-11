import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Footer from "@/components/Footer";

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>ProjectShowcase</title>
        <meta
          name="description"
          content="Explore projects, discover companies, and see the contributions of teams and individuals."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.app}>
        <Header />

        <main className={styles.main}>
          <section className={styles.heroSection}>
            <h1 className={styles.heroTitle}>Welcome to ProjectShowcase</h1>
            <p className={styles.heroSubtitle}>
              Where innovation, collaboration, and achievements come together.
            </p>
            <Link href="/projects">
              <button className={styles.heroButton}>Explore Projects</button>
            </Link>
          </section>

          <div className={styles.infoContainer}>
            <section className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>Projects</h2>
              <p className={styles.sectionText}>
                Dive into a world of completed projects organized by category.
                Each project tells a story of dedication and teamwork.
              </p>
              <Link href="/projects" className={styles.pageLink}>
                Learn More About Projects &rarr;
              </Link>
            </section>

            <section className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>Companies</h2>
              <p className={styles.sectionText}>
                Discover the companies behind these incredible projects and
                explore their achievements.
              </p>
              <Link href="/companies" className={styles.pageLink}>
                Learn More About Our Partners &rarr;
              </Link>
            </section>

            <section className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>My Company</h2>
              <p className={styles.sectionText}>
                Manage and showcase your own projects and accomplishments on
                your personalized company page.
              </p>
              <Link href="/myCompany" className={styles.pageLink}>
                View My Company Page &rarr;
              </Link>
            </section>

            <section className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>Employees</h2>
              <p className={styles.sectionText}>
                Get to know the dedicated individuals who make these projects
                possible and see their contributions.
              </p>
              <Link href="/employees" className={styles.pageLink}>
                Meet Our Team &rarr;
              </Link>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
