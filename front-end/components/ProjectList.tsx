import React, { useEffect, useState } from "react";
import styles from "../styles/ProjectList.module.css";
import { fetchProjectAssignments } from "@/services/EmployeeProjectService";

interface Employee {
  id: number;
  naam: string;
}

interface Category {
  id: number;
  naam: string;
}

interface Project {
  id: number;
  naam: string;
  beschrijving: string;
  datum_voltooid: string;
}

interface ProjectListProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: number) => void;
  onAddEmployeeToProject: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onEditProject,
  onDeleteProject,
  onAddEmployeeToProject,
}) => {
  const [projectDetails, setProjectDetails] = useState<Record<
    number,
    { category: Category | null; employees: Employee[] }
  >>({});

  const handleDelete = (projectId: number) => {
    const confirm = window.confirm("Are you sure you want to delete this project?");
    if (confirm) {
      onDeleteProject(projectId);
    }
  };

  const loadProjectDetails = async (projectId: number) => {
    try {
      const { category, employees } = await fetchProjectAssignments(projectId);
      setProjectDetails((prev) => ({
        ...prev,
        [projectId]: { category, employees },
      }));
    } catch (error) {
      console.error(`Error fetching details for project ${projectId}:`, error);
    }
  };

  useEffect(() => {
    // Fetch details for all projects initially
    projects.forEach((project) => {
      if (project.id) loadProjectDetails(project.id);
    });
  }, [projects]);

  return (
    <div className={styles.projectListContainer}>
      {projects.length > 0 ? (
        <ul className={styles.projectList}>
          {projects.map((project) => {
            const details = projectDetails[project.id] || {};
            return (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.cardActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => onEditProject(project)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </button>
                </div>
                <h2 className={styles.projectTitle}>{project.naam}</h2>
                <p className={styles.projectDescription}>{project.beschrijving}</p>
                <p className={styles.projectDate}>
                  Completion Date:{" "}
                  {new Date(project.datum_voltooid).toLocaleDateString()}
                </p>
                {details.category && (
                  <p className={styles.projectCategory}>
                    <strong>Category:</strong> {details.category.naam}
                  </p>
                )}
                <h3>Assigned Employees:</h3>
                {details.employees && details.employees.length > 0 ? (
                  <ul className={styles.employeeList}>
                    {details.employees.map((employee) => (
                      <li key={employee.id} className={styles.employeeItem}>
                        {employee.naam}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No employees assigned to this project.</p>
                )}
                <button
                  className={styles.addEmployeeButton}
                  onClick={() => onAddEmployeeToProject(project)}
                >
                  Add Employee to Project
                </button>
              </div>
            );
          })}
        </ul>
      ) : (
        <p>No projects available</p>
      )}
    </div>
  );
};

export default ProjectList;
