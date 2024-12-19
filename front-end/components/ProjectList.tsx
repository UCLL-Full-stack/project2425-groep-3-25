import React from "react";
import styles from "../styles/ProjectList.module.css";

interface Project {
  id: number;
  naam: string;
  beschrijving: string;
  datum_voltooid: string;
}

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div className={styles.projectListContainer}>
      {/* <h2 className={styles.projectListTitle}>Projects</h2> */}
      {projects.length > 0 ? (
        <ul className={styles.projectList}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
                  <h2>{project.naam}</h2>
                  <p>Description: {project.beschrijving}</p>
                  <p>
                    Completion Date:{" "}
                    {new Date(project.datum_voltooid).toLocaleDateString()}
                  </p>
            </div>
          ))}
        </ul>
      ) : (
        <p>No projects available</p>
      )}
    </div>
  );
};

export default ProjectList;
