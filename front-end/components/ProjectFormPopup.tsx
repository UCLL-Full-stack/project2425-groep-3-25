import React, { useState } from "react";
import { createProject } from "@/services/ProjectService";
import styles from "../styles/ProjectFormPopup.module.css";

interface ProjectFormPopupProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectFormPopup: React.FC<ProjectFormPopupProps> = ({
  show,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [category, setCategory] = useState(""); // New category field
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !description || !completionDate || !category) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await createProject({
        naam: name,
        beschrijving: description,
        datum_voltooid: completionDate,
        categoryName: category,
      });
      setName("");
      setDescription("");
      setCompletionDate("");
      setCategory("");
      onSuccess(); // Reload projects
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Create New Project</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.inputField}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormPopup;
