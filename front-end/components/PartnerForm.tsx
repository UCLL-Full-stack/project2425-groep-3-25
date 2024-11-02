import React, { useState } from "react";
import styles from "../styles/PartnerForm.module.css";

interface PartnerApplicationFormProps {
  closeModal: () => void;
}

const PartnerApplicationForm: React.FC<PartnerApplicationFormProps> = ({
  closeModal,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Construct data to submit
    const companyData = {
      naam: companyName,
      locatie: location,
      contact_informatie: contactEmail,
      projects: [],
    };

    try {
      const response = await fetch("http://localhost:3000/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });

      if (response.ok) {
        alert("Company added successfully!");
        closeModal(); // Close the modal on successful submission
      } else {
        const errorData = await response.json();
        alert(`Failed to add company: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>Partnership Application</h2>
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
          <label>
            Describe Your Project or Services:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
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
