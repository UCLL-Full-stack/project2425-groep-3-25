import useSWR from "swr";

// Interfaces for Project Data
export interface ProjectInput {
  naam: string;
  beschrijving: string;
  datum_voltooid: string; // Format: YYYY-MM-DD
}

export interface Project extends ProjectInput {
  id: number;
}

// Base URL for API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch data");
  }
  return response.json();
};

// Fetch all projects
export const fetchProjects = async (): Promise<Project[]> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch projects");
  }

  const data = await response.json();
  return data.map((project: any) => ({
    ...project,
    datum_voltooid: project.datum_voltooid || "",
  }));
};

// Fetch a single project by ID
export const fetchProjectById = async (id: number): Promise<Project> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: Failed to fetch project`);
  }
  return response.json();
};

// Create a new project
export const createProject = async (projectData: ProjectInput): Promise<Project> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Error ${response.status}: ${errorData.error || "Failed to create project"}`
    );
  }

  return response.json();
};

// Update an existing project
export const updateProject = async (
  id: number,
  updatedData: Partial<ProjectInput>
): Promise<Project> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Error ${response.status}: ${errorData.error || "Failed to update project"}`
    );
  }

  return response.json();
};

// Delete a project
export const deleteProject = async (id: number): Promise<void> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: Failed to delete project`);
  }
};

// Hook for using SWR to fetch projects
export const useProjects = () => {
  const { data, error } = useSWR<Project[]>(`${API_BASE_URL}/projects`, fetcher);

  return {
    projects: data,
    isLoading: !error && !data,
    isError: error,
  };
};
