import { Company } from '../domain/model/Company';
import { Project } from '../domain/model/Project';
import { CompanyInput, ProjectInput } from '../types';
import { CompanyRepository } from '../repository/Company.db';

export class CompanyService {
    private companyRepository: CompanyRepository;

    constructor(companyRepository: CompanyRepository) {
        this.companyRepository = companyRepository;
    }

    async createCompany(companyData: CompanyInput): Promise<Company> {
        this.validateCompanyData(companyData);
        return await this.companyRepository.create(companyData);
    }

    async getCompanyById(id: number): Promise<Company | undefined> {
        return await this.companyRepository.findById(id);
    }

    async listCompanies(): Promise<Company[]> {
        return await this.companyRepository.findAll();
    }

    async updateCompany(
        id: number,
        updatedData: Partial<CompanyInput>
    ): Promise<Company | undefined> {
        this.validateCompanyData(updatedData as CompanyInput);
        return await this.companyRepository.update(id, updatedData);
    }

    async deleteCompany(id: number): Promise<void> {
        await this.companyRepository.delete(id);
    }

    async addProjectToCompany(
        companyId: number,
        projectData: ProjectInput
    ): Promise<Company | undefined> {
        const company = await this.companyRepository.findById(companyId);
        if (!company) {
            throw new Error('Company not found');
        }

        // Create a new Project and add it to company's project list
        const newProject = new Project({
            id: projectData.id ?? (await this.generateProjectId()),
            naam: projectData.naam!,
            beschrijving: projectData.beschrijving!,
            datum_voltooid: projectData.datum_voltooid!,
        });
        company.projects.push(newProject);

        // Map projects to ProjectInput format before updating
        const companyUpdateData: Partial<CompanyInput> = {
            ...company,
            projects: company.projects.map((project) => ({
                id: project.id,
                naam: project.naam,
                beschrijving: project.beschrijving,
                datum_voltooid: project.datum_voltooid,
                category_id: projectData.category_id, // Ensure category_id is included
            })) as ProjectInput[],
        };

        return await this.companyRepository.update(companyId, companyUpdateData);
    }

    private validateCompanyData(companyData: CompanyInput): void {
        if (!companyData.naam?.trim()) {
            throw new Error('Company name is required.');
        }
        if (!companyData.locatie?.trim()) {
            throw new Error('Company location is required.');
        }
        if (!companyData.contact_informatie?.trim()) {
            throw new Error('Company contact information is required.');
        }
    }

    private async generateProjectId(): Promise<number> {
        const allCompanies = await this.companyRepository.findAll();
        const allProjects = allCompanies.flatMap((company) => company.projects);
        return allProjects.length > 0 ? Math.max(...allProjects.map((p) => p.id)) + 1 : 1;
    }
}
