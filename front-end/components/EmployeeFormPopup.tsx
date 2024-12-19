import React, { useState } from "react";
import { addEmployeeToCompany } from "@/services/EmployeeService";
import styles from "../styles/EmployeeFormPopup.module.css";

interface EmployeeFormPopupProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void; // Function to refresh company data after success
}

const EmployeeFormPopup: React.FC<EmployeeFormPopupProps> = ({ show, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    telefoonnummer: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.telefoonnummer) {
      setError("Email and phone number are required.");
      return;
    }

    try {
      setLoading(true);
      await addEmployeeToCompany(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Add New Employee</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Employee Email"
            className={styles.inputField}
          />
          <input
            type="text"
            name="telefoonnummer"
            value={formData.telefoonnummer}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className={styles.inputField}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormPopup;
