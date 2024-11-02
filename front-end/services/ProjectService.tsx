

export interface ProjectInput {
  naam: string;
  beschrijving: string;
  datum_voltooid: string;
}

export interface Project extends ProjectInput {
  id: number;
}

const API_BASE_URL = "http://localhost:3000/api/projects";

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return await response.json();
};

export const fetchProjectById = async (id: number): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }
  return await response.json();
};

export const createProject = async (
  projectData: ProjectInput
): Promise<Project> => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create project");
  }

  return await response.json();
};

export const updateProject = async (
  id: number,
  updatedData: Partial<ProjectInput>
): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update project");
  }

  return await response.json();
};

export const deleteProject = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
};
