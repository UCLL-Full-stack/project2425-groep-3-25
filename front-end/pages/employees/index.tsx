import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  fetchCompanyEmployees,
  addEmployeeToCompany,
  Employee,
  EmployeeInput,
} from "@/services/EmployeeService";
import styles from "@/styles/Employee.module.css";

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<EmployeeInput>({
    naam: "",
    email: "",
    telefoonnummer: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchCompanyEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.naam || !newEmployee.email || !newEmployee.telefoonnummer) {
      setError("All fields are required.");
      return;
    }

    try {
      const addedEmployee = await addEmployeeToCompany(newEmployee);
      setEmployees((prev) => [...prev, addedEmployee]);
      setNewEmployee({ naam: "", email: "", telefoonnummer: "" });
      setError(null);
    } catch (err) {
      console.error("Error adding employee:", err);
      setError("Failed to add employee. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Employees - Employee Directory</title>
        <meta
          name="description"
          content="View and manage employees in your company."
        />
      </Head>

      <div className={styles.employeePage}>
        <Header />
        <main className={styles.main}>
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>Our Employees</h1>
            <p className={styles.heroSubtitle}>
              View and manage employees in your company.
            </p>
          </section>

          

          {isLoading ? (
            <p className={styles.loadingText}>Loading employees...</p>
          ) : error ? (
            <p className={styles.errorText}>{error}</p>
          ) : (
            <div className={styles.employeeGrid}>
              {employees.map((employee) => (
                <div key={employee.id} className={styles.employeeCard}>
                  <h2>{employee.naam}</h2>
                  <p>Email: {employee.email}</p>
                  <p>Phone: {employee.telefoonnummer}</p>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default EmployeesPage;
