import useSWR from "swr";

// Interfaces for Category Data
export interface CategoryInput {
  naam: string;
  beschrijving: string;
}

export interface Category extends CategoryInput {
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

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch categories");
  }

  return response.json();
};

// Create a new category
export const createCategory = async (categoryData: CategoryInput): Promise<Category> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create category");
  }

  return response.json();
};

// Update an existing category
export const updateCategory = async (
  id: number,
  updatedData: Partial<CategoryInput>
): Promise<Category> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update category");
  }

  return response.json();
};

// Delete a category
export const deleteCategory = async (id: number): Promise<void> => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete category");
  }
};

// Hook for using SWR to fetch categories
export const useCategories = () => {
  const { data, error, mutate } = useSWR<Category[]>(`${API_BASE_URL}/categories`, fetcher);

  return {
    categories: data,
    isLoading: !error && !data,
    isError: error,
    mutate, // Allows revalidating the data
  };
};
