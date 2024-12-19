import useSWR from "swr";

// Interfaces for Company Data
export interface CompanyInput {
  naam: string;
  locatie: string;
  validationInfo: string;
  projects?: any[];
}

export interface Company extends CompanyInput {
  id: number;
  employees?: Employee[];
}

export interface EmployeeInput {
  name: string;
  email: string;
  phone: string;
}

export interface Employee {
  id: number;
  naam: string;
  email: string;
  telefoonnummer: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Fetcher function with Authorization
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

// Function to create a new company
export const createCompany = async (companyData: CompanyInput): Promise<Company> => {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(companyData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error ${response.status}: ${errorData.error || "Failed to create company"}`);
  }

  return response.json();
};

// Function to fetch all companies
export const fetchCompanies = async (): Promise<Company[]> => {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE_URL}/companies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch companies");

  const data = await response.json();
  return data.map((company: any) => ({
    ...company,
    projects: company.projects || [], // Ensure projects is always an array
    employees: company.employees || [], // Ensure employees is always an array
  }));
};

// Function to fetch the logged-in user's company
export const fetchMyCompany = async (): Promise<Company> => {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE_URL}/companies/myCompany`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch your company");
  }

  return response.json();
};

// Function to add an employee to a company
// export const addEmployeeToCompany = async (employeeData: EmployeeInput): Promise<Employee> => {
//   const token = sessionStorage.getItem("token");
//   if (!token) throw new Error("User not authenticated");

//   const response = await fetch(`${API_BASE_URL}/companies/employees`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(employeeData),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(
//       `Error ${response.status}: ${errorData.error || "Failed to add employee to company"}`
//     );
//   }

//   return response.json();
// };

// Hook to fetch the current user's company
export const useMyCompany = () => {
  const { data, error } = useSWR<Company>(`${API_BASE_URL}/companies/myCompany`, fetcher);

  return {
    myCompany: data,
    isLoading: !error && !data,
    isError: error,
  };
};

// Hook to fetch all companies
export const useCompanies = () => {
  const { data, error } = useSWR<Company[]>(`${API_BASE_URL}/companies`, fetcher);

  return {
    companies: data,
    isLoading: !error && !data,
    isError: error,
  };
};
