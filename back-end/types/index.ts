type Role = 'Admin' | 'User';

type ProjectInput = {
    id?: number;
    naam: string;
    beschrijving: string;
    datum_voltooid: Date;
    company_id: number; // ID of the associated Company
    category_id: number; // ID of the associated Category
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
    contact_informatie: string; // Make required if validated as necessary
    projects?: ProjectInput[]; // Optional array of projects
};

type EmployeeInput = {
    id?: number;
    naam: string; // Make required if validated as necessary
    email: string; // Make required if validated as necessary
    telefoonnummer?: string;
    role?: Role; // Role is optional here, but could be required if validated
};

export { CategoryInput, CompanyInput, ProjectInput, EmployeeInput, Role };
