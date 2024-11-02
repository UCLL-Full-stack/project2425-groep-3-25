// pages/companies.tsx

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import styles from "../../styles/Companies.module.css";
import PartnerApplicationForm from "../../components/PartnerForm";

// Define the type for a company
interface Company {
  id: number;
  naam: string;
  locatie: string;
  contact_informatie: string;
  projects: {
    id: number;
    naam: string;
    beschrijving: string;
    datum_voltooid: string;
  }[];
}

const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch companies from the API when the component loads
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/companies");
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Head>
        <title>Companies - ProjectShowcase</title>
        <meta
          name="description"
          content="A showcase of partner companies collaborating on projects"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.companyPage}>
        <Header />

        <main>
          <h1 className={styles.companyTitle}>Our Partner Companies</h1>
          <p className={styles.companyDescription}>
            Browse through our network of partner companies to see the amazing
            projects they've completed and contributed to.
          </p>

          <div className={styles.buttonContainer}>
            <button className={styles.partnerButton} onClick={openModal}>
              Apply to be a Partner
            </button>
          </div>

          {/* Conditionally render the modal */}
          {isModalOpen && <PartnerApplicationForm closeModal={closeModal} />}

          <div className={styles.grid}>
            {companies.map((company) => (
              <div key={company.id} className={styles.card}>
                <h2 className={styles.cardTitle}>{company.naam}</h2>
                <p className={styles.cardText}>Location: {company.locatie}</p>
                <p className={styles.cardText}>
                  Contact: {company.contact_informatie}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default CompaniesPage;
