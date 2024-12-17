type Role = 'Admin' | 'User' | 'Employee'| 'Company';

type ProjectInput = {
    id?: number;
    naam: string;
    beschrijving: string;
    datum_voltooid: Date;
    bedrijf_id: number; // ID of the associated Company
    categorie_id: number; // ID of the associated Category
};

type CategoryInput = {
    id?: number;
    naam: string; // Make required if it’s necessary for all categories
    beschrijving: string; // Make required if it’s necessary for all categories
};

type CompanyInput = {
    id?: number;
    naam: string; // Make required if validated as necessary
    locatie: string; // Make required if validated as necessary
    validationInfo?: string; // Make required if validated as necessary
    projects?: ProjectInput[];
    user_id?: number; // Optional array of projects
};

type EmployeeInput = {
    id?: number;
    naam: string; 
    email: string; 
    telefoonnummer?: string;
    role?: Role;
    user_id?: number;
    bedrijf_id?: number; // Role is optional here, but could be required if validated
};

type UserInput = {
    firstName?: string;
    lastName?: string;
    password?: string;
    email?: string;
    role?: Role;
    companyName?: string; 
    locatie?: string;    
    validationInfo?: string; 
}

type AuthenticationResponse = {
    token: string;
    username: string;
    password: string;
}

export { CategoryInput, CompanyInput, ProjectInput, EmployeeInput, Role, UserInput, AuthenticationResponse };
