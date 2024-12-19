import React, { useState, useEffect } from "react";
import styles from "../styles/ProjectDetailsPopup.module.css";
import { updateProject, ProjectInput } from "@/services/ProjectService";
import { fetchCategories, Category } from "@/services/CategoryService";

interface ProjectDetailsPopupProps {
  show: boolean;
  onClose: () => void;
  onProjectUpdated: () => Promise<void>;
  project: {
    id: number;
    naam: string;
    beschrijving: string;
    datum_voltooid: string;
    categorie_id?: number; // Ensure this is optional if necessary
  };
}

const ProjectDetailsPopup: React.FC<ProjectDetailsPopupProps> = ({
  show,
  onClose,
  onProjectUpdated,
  project,
}) => {
  const [name, setName] = useState(project.naam);
  const [description, setDescription] = useState(project.beschrijving);
  const [date, setDate] = useState(project.datum_voltooid);
  const [categoryId, setCategoryId] = useState(project.categorie_id || 0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories when the popup is shown
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories. Please try again later.");
      }
    };

    if (show) loadCategories();
  }, [show]);

  const handleUpdate = async () => {
    try {
      const updatedData: Partial<ProjectInput> = {
        naam: name,
        beschrijving: description,
        datum_voltooid: date,
        categorie_id: categoryId, // Pass the selected category ID
      };
      await updateProject(project.id, updatedData);
      alert("Project updated successfully!");
      await onProjectUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update project.");
    }
  };

  if (!show) return null;

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Edit Project</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.form}>
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.inputField}
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))} // Convert value to a number
            className={styles.inputField}
          >
            <option  value={0}>Select a Category</option>
            {categories.map((cat) => (
              <option className={styles.inputField2} key={cat.id} value={cat.id}>
                {cat.naam}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.saveButton} onClick={handleUpdate}>
            Save
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPopup;
