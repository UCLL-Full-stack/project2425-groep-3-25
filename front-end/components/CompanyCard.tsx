// components/CompanyCard.tsx

import React from "react";
import styles from "@/styles/Companies.module.css";

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

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{company.naam}</h2>
      <p className={styles.cardText}>Location: {company.locatie}</p>
      <p className={styles.cardText}>Contact: {company.contact_informatie}</p>
    </div>
  );
};

export default CompanyCard;
