import { CompanyService } from '../../service/Company.service';
import { CompanyInput, ProjectInput } from '../../types';
import { CompanyRepository } from '../../repository/Company.db';

describe('CompanyService', () => {
    let companyService: CompanyService;

    let companyRepository: CompanyRepository;

    beforeEach(() => {
        companyRepository = new CompanyRepository();
        companyService = new CompanyService(companyRepository);
    });

    it('should create a company with valid data', () => {
        const companyData: CompanyInput = {
            naam: 'Company A',
            locatie: 'Location A',
            contact_informatie: 'contact@companya.com',
            projects: [],
        };

        const company = companyService.createCompany(companyData);

        expect(company.id).toBeDefined();
        expect(company.naam).toBe('Company A');
        expect(company.locatie).toBe('Location A');
        expect(company.contact_informatie).toBe('contact@companya.com');
        expect(company.projects.length).toBe(0);
    });

    it('should throw an error if naam is empty', () => {
        const companyData: CompanyInput = {
            naam: '',
            locatie: 'Location A',
            contact_informatie: 'contact@companya.com',
            projects: [],
        };

        expect(() => {
            companyService.createCompany(companyData);
        }).toThrow('Company name is required.');
    });

    it('should throw an error if locatie is empty', () => {
        const companyData: CompanyInput = {
            naam: 'Company A',
            locatie: '',
            contact_informatie: 'contact@companya.com',
            projects: [],
        };

        expect(() => {
            companyService.createCompany(companyData);
        }).toThrow('Company location is required.');
    });

    it('should throw an error if contact_informatie is empty', () => {
        const companyData: CompanyInput = {
            naam: 'Company A',
            locatie: 'Location A',
            contact_informatie: '',
            projects: [],
        };

        expect(() => {
            companyService.createCompany(companyData);
        }).toThrow('Company contact information is required.');
    });

    it('should add a project to a company', () => {
        const companyData: CompanyInput = {
            naam: 'Company A',
            locatie: 'Location A',
            contact_informatie: 'contact@companya.com',
            projects: [],
        };

        const company = companyService.createCompany(companyData);

        const projectData: ProjectInput = {
            naam: 'Project A',
            beschrijving: 'Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        };

        const updatedCompany = companyService.addProjectToCompany(company.id, projectData);

        expect(updatedCompany).toBeDefined();
        expect(updatedCompany!.projects.length).toBe(1);
        expect(updatedCompany!.projects[0].naam).toBe('Project A');
    });

    it('should list all companies', () => {
        const companyData1: CompanyInput = {
            naam: 'Company A',
            locatie: 'Location A',
            contact_informatie: 'contact@companya.com',
            projects: [],
        };

        const companyData2: CompanyInput = {
            naam: 'Company B',
            locatie: 'Location B',
            contact_informatie: 'contact@companyb.com',
            projects: [],
        };

        companyService.createCompany(companyData1);
        companyService.createCompany(companyData2);

        const companies = companyService.listCompanies();

        expect(companies[0].naam).toBe('Company A');
        expect(companies[1].naam).toBe('Company B');
    });
});
