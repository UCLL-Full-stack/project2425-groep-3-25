import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import { fetchMyCompany } from "@/services/CompanyService";
import { fetchCompanyEmployees } from "@/services/EmployeeService";
import { deleteProject } from "@/services/ProjectService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectList from "@/components/ProjectList";
import EmployeeList from "@/components/EmployeeList";
import ProjectFormPopup from "@/components/ProjectFormPopup";
import EmployeeFormPopup from "../../components/EmployeeFormPopup"; // Popup form for employees
import styles from "../../styles/MyCompany.module.css";
import ProjectDetailsPopup from "@/components/ProjectDetailsPopup";
import AssignEmployeePopup from "@/components/AssignEmployeePopup";

interface DecodedToken {
  role: string;
  userId: number;
}

interface Company {
  id: number;
  naam: string;
  locatie: string;
  validationInfo: string;
  projects: any[];
  employees: any[];
}

const MyCompany = () => {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [showAssignEmployeePopup, setShowAssignEmployeePopup] = useState(false);


  const loadCompany = async () => {
    try {
      const companyData = await fetchMyCompany();
      const employeeData = await fetchCompanyEmployees();
      const normalizedData: Company = {
        ...companyData,
       projects: (companyData.projects || []).map((project: any) => ({
        ...project,
        employees: project.employees || [],
      })),
        employees: companyData.employees || [],
      };
      setEmployees(employeeData);
      setCompany(normalizedData);
    } catch (err: any) {
      setError(err.message || "Failed to load company data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded: DecodedToken = jwtDecode(token);
    if (decoded.role !== "Company") {
      router.push("/");
      return;
    }

    loadCompany();
  }, [router]);

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setShowProjectDetailsModal(true); // Open ProjectDetailsPopup
  };

  const handleProjectUpdated = async () => {
    await loadCompany(); // Reload the company and its projects
    setShowProjectDetailsModal(false);
  };

  const handleProjectDeleted = async (projectId: number) => {
    try {
      await deleteProject(projectId);
      await loadCompany(); // Refresh company data after deletion
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const handleAddEmployeeToProject = (project: any) => {
    setSelectedProject(project);
    setShowAssignEmployeePopup(true);
  };

  const handleEmployeeDeleted = async () => {
    try {
      await loadCompany(); // Reload the company and employees after deletion
    } catch (error) {
      console.error("Failed to reload employees", error);
    }
  };




  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.myCompanyPage}>
      <Header />
      <main>
      <h1 className={styles.myCompanyTitle}>My Company</h1>

      {company && (
        <>
          <div className={styles.companyDetails}>
            <p><strong>Name:</strong> {company.naam}</p>
            <p><strong>Location:</strong> {company.locatie}</p>
            <p><strong>Description:</strong> {company.validationInfo}</p>
          </div>

          <div className={styles.contentGrid}>
            {/* Projects Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.categorize}>Projects</h2>
                <button
                  className={styles.openProjectButton}
                  onClick={() => setShowProjectModal(true)}
                >
                  Create New Project
                </button>
              </div>
              <ProjectList
                projects={company.projects.map((project) => ({
                  ...project,
                  category: project.category || { id: 0, naam: "No category" }, // Ensure category is always defined
                  employees: project.employees || [], // Ensure employees is always an array
                }))} 
                  onEditProject={handleEditProject}
                  onDeleteProject={handleProjectDeleted}
                  onAddEmployeeToProject={handleAddEmployeeToProject}
                />
                {selectedProject && (
                  <ProjectDetailsPopup
                    show={showProjectDetailsModal}
                    onClose={() => setShowProjectDetailsModal(false)}
                    onProjectUpdated={handleProjectUpdated}
                   
                    project={selectedProject}
                    
                  />
                )}
            </div>

            {/* Employees Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.categorize}>Employees</h2>
                <button
                  className={styles.openProjectButton}
                  onClick={() => setShowEmployeeModal(true)}
                >
                  Add New Employee
                </button>
              </div>
              <EmployeeList employees={employees} />
            </div>
          </div>

          {/* Modals */}
          <ProjectFormPopup
            show={showProjectModal}
            onClose={() => setShowProjectModal(false)}
            onSuccess={loadCompany}
          />

          <EmployeeFormPopup
            show={showEmployeeModal}
            onClose={() => setShowEmployeeModal(false)}
            onSuccess={loadCompany}
            />
            
          <AssignEmployeePopup
              show={showAssignEmployeePopup}
              onClose={() => setShowAssignEmployeePopup(false)}
              projectId={selectedProject?.id || 0}
              employees={employees}
            />
        </>
      )}
      </main>
      <Footer/>
    </div> 
  
  );
};

export default MyCompany;
