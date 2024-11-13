import { CompanyService } from '../../service/Company.service';
import { CompanyRepository } from '../../repository/Company.db';
import { CompanyInput, ProjectInput } from '../../types';

jest.mock('../../repository/Company.db'); // Mock the CompanyRepository

describe('CompanyService', () => {
    let companyService: CompanyService;
    let companyRepository: jest.Mocked<CompanyRepository>;

    beforeEach(() => {
        companyRepository = new CompanyRepository() as jest.Mocked<CompanyRepository>;
        companyService = new CompanyService(companyRepository);
    });

    it('should create a company with valid data', async () => {
        const companyData: CompanyInput = {
            naam: 'Company A',
            locatie: 'Location A',
            contact_informatie: 'contact@companya.com',
            projects: [],
        };

        // Mock the repository method
        companyRepository.create.mockResolvedValue({ ...companyData, id: 1 });

        const company = await companyService.createCompany(companyData);

        expect(company.id).toBeDefined();
        expect(company.naam).toBe('Company A');
        expect(company.locatie).toBe('Location A');
        expect(company.contact_informatie).toBe('contact@companya.com');
        expect(company.projects.length).toBe(0);
    });

    it('should throw an error if naam is empty', async () => {
        const companyData: CompanyInput = {
            naam: '',
            locatie: 'Location A',
            contact_informatie: 'contact@companya.com',
            projects: [],
        };

        await expect(companyService.createCompany(companyData)).rejects.toThrow('Company name is required.');
    });

    it('should add a project to a company', async () => {
        const companyData: CompanyInput = {
            naam: 'Company A',
            locatie: 'Location A',
            contact_informatie: 'contact@companya.com',
            projects: [],
        };

        // Mock the repository method to return the company with ID 1
        companyRepository.create.mockResolvedValue({ ...companyData, id: 1, projects: [] });

        const company = await companyService.createCompany(companyData);

        const projectData: ProjectInput = {
            naam: 'Project A',
            beschrijving: 'Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        };

        // Mock the addProjectToCompany method
        companyRepository.update.mockResolvedValue({
            ...company,
            projects: [projectData],
        });

        const updatedCompany = await companyService.addProjectToCompany(company.id, projectData);

        expect(updatedCompany).toBeDefined();
        expect(updatedCompany!.projects.length).toBe(1);
        expect(updatedCompany!.projects[0].naam).toBe('Project A');
    });
});
