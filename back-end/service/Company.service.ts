import { Company } from '../domain/model/Company';
import { Project } from '../domain/model/Project';
import * as companyDb from '../repository/Company.db';
import * as employeeDb from '../repository/Employee.db';
import * as userDb from '../repository/User.db';
import { CompanyInput, ProjectInput } from '../types';
import jwt from 'jsonwebtoken';

const getAllCompanies = async (): Promise<Company[]> => {
    return await companyDb.getAllCompanies();
};

const getCompanyById = async ({ id }: { id: number }): Promise<Company | null> => {
    const company = await companyDb.getCompanyById({ id });
    if (!company) {
        throw new Error('Company not found');
    }
    return company;
};

const createCompany = async (companyData: CompanyInput): Promise<Company> => {
    validateCompanyData(companyData);
    return await companyDb.createCompany(companyData);
};

const updateCompany = async (
    id: number,
    updatedData: Partial<CompanyInput>
): Promise<Company | null> => {
    validateCompanyData(updatedData as CompanyInput);
    const updatedCompany = await companyDb.updateCompany(id, updatedData);
    if (!updatedCompany) {
        throw new Error('Company not found or could not be updated');
    }
    return updatedCompany;
};

const deleteCompany = async ({ id }: { id: number }): Promise<void> => {
    const companyExists = await companyDb.getCompanyById({ id });
    if (!companyExists) {
        throw new Error('Company not found');
    }
    await companyDb.deleteCompany({ id });
};

const addProjectToCompany = async (
    companyId: number,
    projectData: ProjectInput
): Promise<Company> => {
    const company = await companyDb.getCompanyById({ id: companyId });
    if (!company) {
        throw new Error('Company not found');
    }

    const newProject = new Project({
        id: projectData.id ?? (await generateProjectId()),
        naam: projectData.naam!,
        bedrijf_id: projectData.bedrijf_id,
        categorie_id: projectData.categorie_id,
        beschrijving: projectData.beschrijving!,
        datum_voltooid: projectData.datum_voltooid!,
    });
    company.projects.push(newProject);

    const companyUpdateData: Partial<CompanyInput> = {
        ...company,
        projects: company.projects.map((project) => ({
            id: project.id,
            naam: project.naam,
            beschrijving: project.beschrijving,
            datum_voltooid: project.datum_voltooid,
            categorie_id: projectData.categorie_id,
        })) as ProjectInput[],
        user_id: company.user_id ?? undefined,
    };

    const updatedCompany = await companyDb.updateCompany(companyId, companyUpdateData);
    if (!updatedCompany) {
        throw new Error('Company not found or could not be updated');
    }
    return updatedCompany;
};



const validateCompanyData = (companyData: CompanyInput): void => {
    if (!companyData.naam?.trim()) {
        throw new Error('Company name is required.');
    }
    if (!companyData.locatie?.trim()) {
        throw new Error('Company location is required.');
    }
    if (!companyData.validationInfo?.trim()) {
        throw new Error('Company information is required.');
    }
};

const getCompanyByUserId = async (userId: number): Promise<Company | null> => {
    const company = await companyDb.getCompanyByUserId(userId);
    if (!company) {
      throw new Error('Company not found.');
    }
    
    return company;
  };
  

const generateProjectId = async (): Promise<number> => {
    const allCompanies = await companyDb.getAllCompanies();
    const allProjects = allCompanies.flatMap((company) => company.projects);
    return allProjects.length > 0 ? Math.max(...allProjects.map((p) => p.id!).filter(id => id !== undefined)) + 1 : 1;
};

export default {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    addProjectToCompany,
    getCompanyByUserId,
};
