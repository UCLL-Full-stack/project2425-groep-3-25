import React, { useState } from "react";
import styles from "../styles/LoginPopUp.module.css";

interface PartnerApplicationFormProps {
  closeModal: () => void;
  onCompanyCreated: (company: {
    naam: string;
    locatie: string;
    contact_informatie: string;
    telefoonnummer: string;
    contact_method: string;
    additional_info?: string;
  }) => void;
}

const PartnerApplicationForm: React.FC<PartnerApplicationFormProps> = ({
  closeModal,
  onCompanyCreated,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState("Email");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!companyName || !location || !contactEmail || !phoneNumber) {
      setError("Please fill out all required fields.");
      return;
    }

    const companyData = {
      naam: companyName,
      locatie: location,
      contact_informatie: contactEmail,
      telefoonnummer: phoneNumber,
      contact_method: preferredContactMethod,
      additional_info: additionalInfo,
    };

    onCompanyCreated(companyData);
    closeModal();
  };

  return (
    <div
      className={styles["popup-overlay"]}
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className={styles["popup-container"]}>
        <div className={styles["popup-header"]}>
          <h2>Partner Application</h2>
          <button onClick={closeModal} className={styles["close-button"]}>
            X
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className={styles["label-popUp"]}>Company Name:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={styles["popup-input"]}
            required
          />
          <label className={styles["label-popUp"]}>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={styles["popup-input"]}
            required
          />
          <label className={styles["label-popUp"]}>Contact Email:</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className={styles["popup-input"]}
            required
          />
          <label className={styles["label-popUp"]}>Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={styles["popup-input"]}
            required
          />
          <label className={styles["label-popUp"]}>
            Preferred Contact Method:
          </label>
          <select
            value={preferredContactMethod}
            onChange={(e) => setPreferredContactMethod(e.target.value)}
            className={styles["popup-input"]}
          >
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
          </select>
          <label className={styles["label-popUp"]}>
            Additional Information:
          </label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className={styles["popup-input"]}
            placeholder="Additional details about your company"
          />
          <div className={styles["popup-buttons"]}>
            <button type="submit" className={styles["login-button"]}>
              Submit Application
            </button>
            <button
              type="button"
              onClick={closeModal}
              className={styles["cancel-button"]}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerApplicationForm;
