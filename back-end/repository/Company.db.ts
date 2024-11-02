import { Company } from '../domain/model/Company';
import { CompanyInput } from '../types';
import { Project } from '../domain/model/Project';

export class CompanyRepository {
    private companies: Company[] = [];

    constructor() {
        this.companies = [
            new Company({
                id: 1,
                naam: 'Company A',
                locatie: 'Location A',
                contact_informatie: 'contact@companya.com',
                projects: [],
            }),
            new Company({
                id: 2,
                naam: 'Company B',
                locatie: 'Location B',
                contact_informatie: 'contact@companyb.com',
                projects: [],
            }),
        ];
    }

    create(companyData: CompanyInput): Company {
        const newCompany = new Company({
            id: this.generateId(),
            naam: companyData.naam || '',
            locatie: companyData.locatie || '',
            contact_informatie: companyData.contact_informatie || '',
        });
        this.companies.push(newCompany);
        return newCompany;
    }

    findById(id: number): Company | undefined {
        return this.companies.find((company) => company.id === id);
    }

    findAll(): Company[] {
        return this.companies;
    }

    update(id: number, updatedData: Partial<CompanyInput>): Company | undefined {
        const company = this.findById(id);
        if (!company) {
            return undefined;
        }

        const updatedCompany = new Company({
            ...company,
            ...updatedData,
            id: company.id,
            projects: updatedData.projects
                ? updatedData.projects.map(
                      (projectInput) =>
                          new Project({
                              id: projectInput.id ?? this.generateProjectId(),
                              naam: projectInput.naam!,
                              beschrijving: projectInput.beschrijving!,
                              datum_voltooid: projectInput.datum_voltooid!,
                          })
                  )
                : company.projects,
        });

        this.companies = this.companies.map((c) => (c.id === id ? updatedCompany : c));
        return updatedCompany;
    }

    private generateProjectId(): number {
        const allProjects = this.companies.flatMap((company) => company.projects);
        return allProjects.length > 0 ? Math.max(...allProjects.map((p) => p.id)) + 1 : 1;
    }

    delete(id: number): void {
        this.companies = this.companies.filter((company) => company.id !== id);
    }

    private generateId(): number {
        return this.companies.length > 0 ? Math.max(...this.companies.map((c) => c.id)) + 1 : 1;
    }
}
