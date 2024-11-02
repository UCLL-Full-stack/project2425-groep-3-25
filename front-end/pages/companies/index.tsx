// pages/companies.tsx

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import CompanyCard from "../../components/CompanyCard";
import PartnerApplicationForm from "../../components/PartnerApplicationForm";
import { fetchCompanies } from "@/services/CompanySerice";
import styles from "@/styles/Companies.module.css";

// Define the Company type
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
    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    loadCompanies();
  }, []);

  // Function to handle the modal opening
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to add a new company to the list
  const handleCompanyCreated = (
    companyInput: Omit<Company, "id" | "projects">
  ) => {
    const newCompany: Company = {
      id: companies.length + 1, // Temporary ID, replace with real ID if possible
      ...companyInput,
      projects: [], // Assume new companies have no projects initially
    };
    setCompanies((prevCompanies) => [...prevCompanies, newCompany]);
  };

  return (
    <>
      <Head>
        <title>Companies - ProjectShowcase</title>
        <meta
          name="description"
          content="A showcase of partner companies collaborating on projects"
        />
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
          {isModalOpen && (
            <PartnerApplicationForm
              closeModal={closeModal}
              onCompanyCreated={handleCompanyCreated}
            />
          )}

          <div className={styles.grid}>
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default CompaniesPage;
