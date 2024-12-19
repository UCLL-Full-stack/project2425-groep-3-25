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
    categoryName: "", // Add the missing categoryName property
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setIsLoading(false);
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
      setNewProject({ naam: "", beschrijving: "", datum_voltooid: "", categoryName: "" });
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
        <meta
          name="description"
          content="Explore our collaborative projects and contribute to making a difference."
        />
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

          
          

          {isLoading ? (
            <p className={styles.loadingText}>Loading projects...</p>
          ) : error ? (
            <p className={styles.errorText}>{error}</p>
          ) : (
            <div className={styles.projectGrid}>
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
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProjectsPage;
