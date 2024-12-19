import React, { useEffect, useState } from "react";
import { createProject } from "@/services/ProjectService";
import styles from "../styles/ProjectFormPopup.module.css";
import { fetchCategories, Category } from "@/services/CategoryService";

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
  const [categoryId, setCategoryId] = useState<number | "">(""); // Selected category ID
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !description || !completionDate || !categoryId) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const selectedCategory = categories.find(cat => cat.id === categoryId);
      await createProject({
        naam: name,
        beschrijving: description,
        datum_voltooid: completionDate,
        categorie_id: categoryId, // Pass the selected category ID
        categoryName: selectedCategory ? selectedCategory.naam : "",
      });
      setName("");
      setDescription("");
      setCompletionDate("");
      setCategoryId("");
      onSuccess(); // Reload projects
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  if (!show) return null;

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
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className={styles.inputField}
          >
            <option  value="">Select a Category</option>
            {categories.map((cat) => (
              <option className={styles.inputField2} key={cat.id} value={cat.id}>
                {cat.naam}
              </option>
            ))}
          </select>
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
