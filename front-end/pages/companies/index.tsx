import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import CompanyCard from "../../components/CompanyCard";
import PartnerApplicationForm from "../../components/PartnerApplicationForm";
import { fetchCompanies } from "@/services/CompanyService";
import styles from "@/styles/Companies.module.css";
import Footer from "@/components/Footer";

interface Company {
  id: number;
  naam: string;
  locatie: string;
  validationInfo: string;
  user_id: number;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies();
        const companiesWithId = data.map((company, index) => ({
          ...company,
          id: index + 1,
          projects: company.projects || [],
        }));
        setCompanies(companiesWithId);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to load companies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCompanies();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCompanyCreated = (
    company: {
      naam: string;
      locatie: string;
      contact_informatie: string;
      telefoonnummer: string;
      contact_method: string;
      additional_info?: string;
    }
  ) => {
    const newCompany: Company = {
      id: companies.length + 1,
      naam: company.naam,
      locatie: company.locatie,
      validationInfo: "",
      user_id: 0,
      projects: [],
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

          {/* <div className={styles.buttonContainer}>
            <button className={styles.partnerButton} onClick={openModal}>
              Apply to be a Partner
            </button>
          </div> */}

          {/* {isModalOpen && (
            <PartnerApplicationForm
              closeModal={closeModal}
              onCompanyCreated={handleCompanyCreated}
            />
          )} */}

          {isLoading ? (
            <p className={styles.loading}>Loading companies...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <div className={styles.grid}>
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CompaniesPage;
