import useSWR from "swr";

// Employee Interface
export interface Employee {
  id: number;
  naam: string;
  email: string;
  telefoonnummer: string;
}

// Employee Input Interface for Adding Employees
export interface EmployeeInput {
  naam: string;
  email: string;
  telefoonnummer: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// SWR Fetcher Function
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

// Fetch All Employees for the Logged-in Company
export const fetchCompanyEmployees = async (): Promise<Employee[]> => {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE_URL}/employees/employees`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch employees");
  }

  return response.json();
};

// Add an Employee to the Company
export const addEmployeeToCompany = async (
  employeeData: EmployeeInput
): Promise<Employee> => {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE_URL}/employees/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(employeeData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Error ${response.status}: ${errorData.error || "Failed to add employee"}`
    );
  }

  return response.json();
};

// Hook to Fetch Employees with SWR
export const useCompanyEmployees = () => {
  const { data, error } = useSWR<Employee[]>(
    `${API_BASE_URL}/employees/employees`,
    fetcher
  );

  return {
    employees: data,
    isLoading: !data && !error,
    isError: error,
  };
};
