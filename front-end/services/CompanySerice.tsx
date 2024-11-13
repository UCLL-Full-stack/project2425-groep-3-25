// services/companyService.ts

export interface CompanyInput {
  naam: string;
  locatie: string;
  contact_informatie: string;
}

export const createCompany = async (companyData: CompanyInput) => {
  const response = await fetch("http://localhost:3000/api/companies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(companyData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create company");
  }

  return await response.json();
};

export const fetchCompanies = async (): Promise<CompanyInput[]> => {
  const response = await fetch("http://localhost:3000/api/companies");
  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : []; // Ensures data is an array
};
