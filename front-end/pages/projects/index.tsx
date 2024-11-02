// pages/projects.tsx

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  Project,
  ProjectInput,
} from "@/services/ProjectService";
import styles from "@/styles/Project.module.css";

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<ProjectInput>({
    naam: "",
    beschrijving: "",
    datum_voltooid: "",
  });
  const [isEditing, setIsEditing] = useState<number | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    loadProjects();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async () => {
    try {
      const addedProject = await createProject(newProject);
      setProjects((prev) => [...prev, addedProject]);
      setNewProject({ naam: "", beschrijving: "", datum_voltooid: "" });
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

//   const handleEditProject = (project: Project) => {
//     setIsEditing(project.id);
//     setNewProject({
//       naam: project.naam,
//       beschrijving: project.beschrijving,
//       datum_voltooid: project.datum_voltooid,
//     });
//   };

//   const handleUpdateProject = async () => {
//     if (isEditing === null) return;

//     try {
//       const updatedProject = await updateProject(isEditing, newProject);
//       setProjects((prev) =>
//         prev.map((project) =>
//           project.id === isEditing ? updatedProject : project
//         )
//       );
//       setIsEditing(null);
//       setNewProject({ naam: "", beschrijving: "", datum_voltooid: "" });
//     } catch (error) {
//       console.error("Error updating project:", error);
//     }
//   };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Projects - ProjectShowcase</title>
      </Head>

      <div className={styles.projectPage}>
        <Header />

        <main>
          <h1 className={styles.title}>Our Projects</h1>

          <div className={styles.projectForm}>
            <input
              type="text"
              name="naam"
              value={newProject.naam}
              onChange={handleInputChange}
              placeholder="Project Name"
              required
            />
            <textarea
              name="beschrijving"
              value={newProject.beschrijving}
              onChange={handleInputChange}
              placeholder="Description"
              required
            />
            <input
              type="date"
              name="datum_voltooid"
              value={newProject.datum_voltooid}
              onChange={handleInputChange}
              required
            />
{/* 
            {isEditing ? (
              <button onClick={handleUpdateProject}>Update Project</button>
            ) : (
              <button onClick={handleAddProject}>Add Project</button>
            )} */}
          </div>

          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <h2>{project.naam}</h2>
                <p>{project.beschrijving}</p>
                <p>Completion Date: {project.datum_voltooid}</p>
                {/* <button onClick={() => handleEditProject(project)}>Edit</button>
                <button onClick={() => handleDeleteProject(project.id)}> */}
                  {/* Delete */}
                {/* </button> */}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectsPage;
