import { Company } from '../domain/model/Company';
import { Project } from '../domain/model/Project';
import { CompanyInput, ProjectInput } from '../types';
import { CompanyRepository } from '../repository/Company.db';

export class CompanyService {
    private companyRepository: CompanyRepository;

    constructor(companyRepository: CompanyRepository) {
        this.companyRepository = companyRepository;
    }

    createCompany(companyData: CompanyInput): Company {
        this.validateCompanyData(companyData);
        return this.companyRepository.create(companyData);
    }

    getCompanyById(id: number): Company | undefined {
        return this.companyRepository.findById(id);
    }

    listCompanies(): Company[] {
        return this.companyRepository.findAll();
    }

    updateCompany(id: number, updatedData: Partial<CompanyInput>): Company | undefined {
        this.validateCompanyData(updatedData as CompanyInput);
        return this.companyRepository.update(id, updatedData);
    }

    deleteCompany(id: number): void {
        this.companyRepository.delete(id);
    }

    addProjectToCompany(companyId: number, projectData: ProjectInput): Company | undefined {
        const company = this.companyRepository.findById(companyId);
        if (!company) {
            throw new Error('Company not found');
        }

        const newProject = new Project({
            id: projectData.id ?? this.generateProjectId(),
            naam: projectData.naam!,
            beschrijving: projectData.beschrijving!,
            datum_voltooid: projectData.datum_voltooid!
        });

        company.projects.push(newProject);
        return this.companyRepository.update(companyId, company);
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

    private generateProjectId(): number {
        const allProjects = this.companyRepository.findAll().flatMap(company => company.projects);
        return allProjects.length > 0 ? Math.max(...allProjects.map(p => p.id)) + 1 : 1;
    }
}
