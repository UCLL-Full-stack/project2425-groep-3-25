import React from "react";
import styles from "../styles/EmployeeList.module.css";

interface Employee {
  id: number;
  naam: string;
  email: string;
  telefoonnummer: string;
}

interface EmployeeListProps {
  employees: Employee[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
  return (
    <div className={styles.employeeListContainer}>
      {/* <h2 className={styles.employeeListTitle}>Employees</h2> */}
      {employees.length > 0 ? (
        <ul className={styles.employeeList}>
          {employees.map((employee) => (
            <li key={employee.id} className={styles.employeeItem}>
              <strong>{employee.naam}</strong>
              <p className={styles.employeeDetails}>
                Email: {employee.email} | Phone: {employee.telefoonnummer}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No employees available</p>
      )}
    </div>
  );
};

export default EmployeeList;
