export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "Employee" | "Company" | "User"; 
  locatie?: string; // Optional for "employee"
  companyName?: string; // Required for "partner"
  validationInfo?: string; // Optional validation info
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

export const signUp = async (signUpData: RegisterInput): Promise<any> => {

  if (signUpData.role === "Company") {
    if (!signUpData.companyName || !signUpData.locatie || !signUpData.validationInfo) {
      throw new Error("Company registration requires companyName, locatie, and validationInfo.");
    }
  }

  const response = await fetch(`${API_BASE_URL}/users/signUp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signUpData), // Send updated payload
  });

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to sign up");
  }

  return await response.json();
};


export const login = async ({ email, password }: { email: string; password: string }): Promise<any> => {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), 
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }
  
    return await response.json(); 
  };
  