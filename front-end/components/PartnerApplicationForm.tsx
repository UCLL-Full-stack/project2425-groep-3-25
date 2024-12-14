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
  const [formState, setFormState] = useState({
    companyName: "",
    location: "",
    contactEmail: "",
    phoneNumber: "",
    preferredContactMethod: "Email",
    additionalInfo: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const { companyName, location, contactEmail, phoneNumber } = formState;

    if (!companyName || !location || !contactEmail || !phoneNumber) {
      setError("Please fill out all required fields.");
      return;
    }

    const companyData = {
      naam: companyName,
      locatie: location,
      contact_informatie: contactEmail,
      telefoonnummer: phoneNumber,
      contact_method: formState.preferredContactMethod,
      additional_info: formState.additionalInfo,
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
            &times;
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className={styles["label-popUp"]}>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={formState.companyName}
            onChange={handleChange}
            className={styles["popup-input"]}
            required
          />
          <label className={styles["label-popUp"]}>Location:</label>
          <input
            type="text"
            name="location"
            value={formState.location}
            onChange={handleChange}
            className={styles["popup-input"]}
            required
          />
          <label className={styles["label-popUp"]}>Contact Email:</label>
          <input
            type="email"
            name="contactEmail"
            value={formState.contactEmail}
            onChange={handleChange}
            className={styles["popup-input"]}
            required
          />
          <label className={styles["label-popUp"]}>Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formState.phoneNumber}
            onChange={handleChange}
            className={styles["popup-input"]}
            required
          />
          <label className={styles["label-popUp"]}>
            Preferred Contact Method:
          </label>
          <select
            name="preferredContactMethod"
            value={formState.preferredContactMethod}
            onChange={handleChange}
            className={styles["popup-input"]}
          >
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
          </select>
          <label className={styles["label-popUp"]}>
            Additional Information:
          </label>
          <textarea
            name="additionalInfo"
            value={formState.additionalInfo}
            onChange={handleChange}
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
