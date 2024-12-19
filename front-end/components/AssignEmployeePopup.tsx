import React, { useState } from "react";
import styles from "../styles/AssignEmployeePopup.module.css";
import { assignEmployeeToProject } from "@/services/EmployeeProjectService";

interface Employee {
  id: number;
  naam: string;
  email: string;
}

interface AssignEmployeePopupProps {
  show: boolean;
  onClose: () => void;
  projectId: number;
  employees: Employee[];
}

const AssignEmployeePopup: React.FC<AssignEmployeePopupProps> = ({
  show,
  onClose,
  projectId,
  employees,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAssign = async () => {
    if (!selectedEmployeeId || !role) {
      setError("Please select an employee and provide a role.");
      return;
    }
    try {
      await assignEmployeeToProject({
        projectId,
        employeeId: selectedEmployeeId,
        role,
      });
      alert("Employee assigned to project successfully!");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to assign employee.");
    }
  };

  if (!show) return null;

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Assign Employee to Project</h2>
        {error && <p className={styles.error}>{error}</p>}
        <select
          className={styles.inputField}
          onChange={(e) => setSelectedEmployeeId(parseInt(e.target.value))}
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.naam} ({employee.email})
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={styles.inputField}
        />
        <button className={styles.submitButton} onClick={handleAssign}>
          Assign Employee
        </button>
      </div>
    </div>
  );
};

export default AssignEmployeePopup;
