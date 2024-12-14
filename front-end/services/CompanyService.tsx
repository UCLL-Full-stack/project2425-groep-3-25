import useSWR from "swr";

// Interfaces for Company Data
export interface CompanyInput {
  naam: string;
  locatie: string;
  contact_informatie: string;
  projects?: any[];
}

export interface Company extends CompanyInput {
  id: number;
}

// Base URL for API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch data");
  }
  return response.json();
};

// Function to create a new company
export const createCompany = async (companyData: CompanyInput): Promise<Company> => {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(companyData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Error ${response.status}: ${errorData.error || "Failed to create company"}`
    );
  }

  return response.json();
};

// Function to fetch all companies
export const fetchCompanies = async (): Promise<Company[]> => {
  const response = await fetch(`${API_BASE_URL}/companies`);
  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }

  const data = await response.json();
  return data.map((company: any) => ({
    ...company,
    projects: company.projects || [], // Ensure projects is always an array
  }));
};

// Hook for using SWR to fetch companies
export const useCompanies = () => {
  const { data, error } = useSWR<Company[]>(`${API_BASE_URL}/companies`, fetcher);

  return {
    companies: data,
    isLoading: !error && !data,
    isError: error,
  };
};
