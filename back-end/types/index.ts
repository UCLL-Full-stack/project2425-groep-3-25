type Role = 'Admin' | 'User';

type ProjectInput = {
    id?: number;
    naam?: string;
    beschrijving?: string;
    datum_voltooid?: Date;
};

type CategoryInput = {
    id?: number;
    naam?: string;
    beschrijving?: string;
};

type CompanyInput = {
    id?: number;
    naam?: string;
    locatie?: string;
    contact_informatie?: string;
    projects?: ProjectInput[];
};

type EmployeeInput = {
    id?: number;
    naam?: string;
    email?: string;
    telefoonnummer?: string;
    role?: Role;
};

export { CategoryInput, CompanyInput, ProjectInput, EmployeeInput, Role };
