import companyService from '../../service/Company.service';
import * as companyDb from '../../repository/Company.db';
import { Company } from '../../domain/model/Company';
import { Project } from '../../domain/model/Project';
import { CompanyInput, ProjectInput } from '../../types';


jest.mock('../../repository/Company.db');


describe('CompanyService - addProjectToCompany', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllCompanies', () => {
        it('should return all companies', async () => {
            const companies: Company[] = [
                new Company({ id: 1, naam: 'Company A', locatie: 'Location A', contact_informatie: 'Contact A', projects: [] }),
                new Company({ id: 2, naam: 'Company B', locatie: 'Location B', contact_informatie: 'Contact B', projects: [] }),
            ];
            (companyDb.getAllCompanies as jest.Mock).mockResolvedValue(companies);

            const result = await companyService.getAllCompanies();
            expect(result).toEqual(companies);
            expect(companyDb.getAllCompanies).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCompanyById', () => {
        it('should return a company by ID', async () => {
            const company = new Company({ id: 1, naam: 'Company A', locatie: 'Location A', contact_informatie: 'Contact A', projects: [] });
            (companyDb.getCompanyById as jest.Mock).mockResolvedValue(company);

            const result = await companyService.getCompanyById({ id: 1 });
            expect(result).toEqual(company);
            expect(companyDb.getCompanyById).toHaveBeenCalledWith({ id: 1 });
        });

        it('should throw an error if the company is not found', async () => {
            (companyDb.getCompanyById as jest.Mock).mockResolvedValue(null);

            await expect(companyService.getCompanyById({ id: 1 })).rejects.toThrow('Company not found');
        });
    });

    describe('createCompany', () => {
        it('should create a new company', async () => {
            const companyInput: CompanyInput = { naam: 'Company A', locatie: 'Location A', contact_informatie: 'Contact A' };
            const createdCompany = new Company({ ...companyInput, id: 1, projects: [] });
            (companyDb.createCompany as jest.Mock).mockResolvedValue(createdCompany);

            const result = await companyService.createCompany(companyInput);
            expect(result).toEqual(createdCompany);
            expect(companyDb.createCompany).toHaveBeenCalledWith(companyInput);
        });

        it('should throw an error for invalid company data', async () => {
            const invalidCompanyInput: CompanyInput = { naam: '', locatie: '', contact_informatie: '' };

            await expect(companyService.createCompany(invalidCompanyInput)).rejects.toThrow('Company name is required.');
        });
    });

    describe('updateCompany', () => {
        it('should update an existing company', async () => {
            const updatedData: Partial<CompanyInput> = { naam: 'Updated Company A', locatie: 'Updated Location A', contact_informatie: 'Updated Contact A' };
            const updatedCompany = new Company({ id: 1, naam: 'Updated Company A', locatie: 'Location A', contact_informatie: 'Contact A', projects: [] });
            (companyDb.updateCompany as jest.Mock).mockResolvedValue(updatedCompany);

            const result = await companyService.updateCompany(1, updatedData);
            expect(result).toEqual(updatedCompany);
            expect(companyDb.updateCompany).toHaveBeenCalledWith(1, updatedData);
        });

        it('should throw an error if the company is not found', async () => {
            (companyDb.updateCompany as jest.Mock).mockResolvedValue(null);

            await expect(companyService.updateCompany(1, { naam: 'Updated Company A' })).rejects.toThrow('Company location is required.');
        });
    });

    describe('deleteCompany', () => {
        it('should delete a company by ID', async () => {
            (companyDb.getCompanyById as jest.Mock).mockResolvedValue({ id: 1 });
            (companyDb.deleteCompany as jest.Mock).mockResolvedValue(undefined);

            await companyService.deleteCompany({ id: 1 });
            expect(companyDb.deleteCompany).toHaveBeenCalledWith({ id: 1 });
        });

        it('should throw an error if the company is not found', async () => {
            (companyDb.getCompanyById as jest.Mock).mockResolvedValue(null);

            await expect(companyService.deleteCompany({ id: 1 })).rejects.toThrow('Company not found');
        });
    });

    it('should throw an error if the company does not exist', async () => {
        (companyDb.getCompanyById as jest.Mock).mockResolvedValue(null);

        await expect(
            companyService.addProjectToCompany(999, {
                naam: 'New Project',
                beschrijving: 'Project Description',
                datum_voltooid: new Date('2023-12-01'),
                company_id: 999,
                category_id: 1,
            })
        ).rejects.toThrow('Company not found');
    });
});
