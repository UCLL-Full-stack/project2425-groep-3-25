// components/PartnerApplicationForm.tsx

import React, { useState } from "react";

import styles from "../styles/PartnerForm.module.css";
import { CompanyInput, createCompany } from "@/services/CompanySerice";

interface PartnerApplicationFormProps {
  closeModal: () => void;
  onCompanyCreated: (company: CompanyInput) => void;
}

const PartnerApplicationForm: React.FC<PartnerApplicationFormProps> = ({
  closeModal,
  onCompanyCreated,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const companyData = {
      naam: companyName,
      locatie: location,
      contact_informatie: contactEmail,
    };

    try {
      const newCompany = await createCompany(companyData);
      onCompanyCreated(newCompany); // Send new company data to parent
      closeModal();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>Partnership Application</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Company Name:
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </label>
          <label>
            Contact Email:
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit" className={styles.submitButton}>
            Submit Application
          </button>
          <button
            type="button"
            onClick={closeModal}
            className={styles.closeButton}
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerApplicationForm;
