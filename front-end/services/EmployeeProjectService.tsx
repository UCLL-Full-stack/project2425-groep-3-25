const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Utility function to handle requests with authorization
const fetchWithToken = async (url: string, options: RequestInit = {}) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Request failed");
  }

  return response.json();
};

// Function to assign an employee to a project
export const assignEmployeeToProject = async ({
  projectId,
  employeeId,
  role,
}: {
  projectId: number;
  employeeId: number;
  role: string;
}): Promise<void> => {
  return await fetchWithToken(`${API_BASE_URL}/employeeprojects/projects/${projectId}/employees`, {
    method: "POST",
    body: JSON.stringify({ employeeId, role }),
  });
};

// Function to fetch all employees assigned to a project
export const fetchProjectAssignments = async (projectId: number) => {
  const data = await fetchWithToken(`${API_BASE_URL}/employeeprojects/${projectId}/employees`);

  // Return both the category and employees
  return {
    category: data.category,
    employees: data.employees,
  };
};
