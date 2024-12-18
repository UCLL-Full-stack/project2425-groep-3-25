import React from "react";
import styles from "@/styles/Companies.module.css";

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

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{company.naam}</h2>
      <p className={styles.cardText}>Location: {company.locatie}</p>
      <p className={styles.cardText}>Description: {company.validationInfo}</p>
    </div>
  );
};

export default CompanyCard;
