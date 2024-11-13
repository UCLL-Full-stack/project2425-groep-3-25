// pages/projects.tsx

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import {
  fetchProjects,
  createProject,
  Project,
  ProjectInput,
} from "@/services/ProjectService";
import styles from "@/styles/Project.module.css";
import Footer from "@/components/Footer";

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<ProjectInput>({
    naam: "",
    beschrijving: "",
    datum_voltooid: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
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
    if (
      !newProject.naam ||
      !newProject.beschrijving ||
      !newProject.datum_voltooid
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const addedProject = await createProject(newProject);
      setProjects((prev) => [...prev, addedProject]);
      setNewProject({ naam: "", beschrijving: "", datum_voltooid: "" });
      setError(null);
    } catch (error) {
      console.error("Error adding project:", error);
      setError("Failed to add project. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Projects - ProjectShowcase</title>
      </Head>

      <div className={styles.projectPage}>
        <Header />
        <main className={styles.main}>
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>Our Projects</h1>
            <p className={styles.heroSubtitle}>
              Explore our collaborative projects and join us in making a
              difference.
            </p>
          </section>

          <div className={styles.projectForm}>
            {error && <p className={styles.errorText}>{error}</p>}
            <input
              type="text"
              name="naam"
              value={newProject.naam}
              onChange={handleInputChange}
              placeholder="Project Name"
              required
              className={styles.inputField}
            />
            <textarea
              name="beschrijving"
              value={newProject.beschrijving}
              onChange={handleInputChange}
              placeholder="Description"
              required
              className={styles.inputField}
            />
            <input
              type="date"
              name="datum_voltooid"
              value={newProject.datum_voltooid}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
            <button onClick={handleAddProject} className={styles.submitButton}>
              Add Project
            </button>
          </div>

          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <h2>{project.naam}</h2>
                <p>{project.beschrijving}</p>
                <p>
                  Completion Date:{" "}
                  {new Date(project.datum_voltooid).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProjectsPage;
