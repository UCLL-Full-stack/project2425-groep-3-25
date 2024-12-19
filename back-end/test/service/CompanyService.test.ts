import companyService from '../../service/Company.service'; 
import * as companyDb from '../../repository/Company.db';
import { CompanyInput, ProjectInput } from '../../types';
import { Company } from '../../domain/model/Company';

jest.mock('../../repository/Company.db');

describe('Company Service Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllCompanies', () => {
        it('should return all companies', async () => {
            const mockCompanies = [
                new Company({ id: 1, naam: 'Company A', locatie: 'Location A', validationInfo: 'Valid', user_id: 1 }),
            ];
            (companyDb.getAllCompanies as jest.Mock).mockResolvedValue(mockCompanies);

            const result = await companyService.getAllCompanies();

            expect(companyDb.getAllCompanies).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockCompanies);
        });
    });

    
    describe('getCompanyById', () => {
        it('should return the correct company', async () => {
            const mockCompany = new Company({ id: 1, naam: 'Company A', locatie: 'Location A', validationInfo: 'Valid', user_id: 1 });
            (companyDb.getCompanyById as jest.Mock).mockResolvedValue(mockCompany);

            const result = await companyService.getCompanyById({ id: 1 });

            expect(companyDb.getCompanyById).toHaveBeenCalledWith({ id: 1 });
            expect(result).toEqual(mockCompany);
        });

        it('should throw an error if the company does not exist', async () => {
            (companyDb.getCompanyById as jest.Mock).mockResolvedValue(null);

            await expect(companyService.getCompanyById({ id: 999 })).rejects.toThrow('Company not found');
        });
    });

    describe('createCompany', () => {
        it('should create a company', async () => {
            const companyInput: CompanyInput = {
                naam: 'New Company',
                locatie: 'New Location',
                validationInfo: 'Contact Info',
                user_id: 1,
            };

            const mockCompany = new Company({ id: 1, naam: 'Company A', locatie: 'Location A', validationInfo: 'Valid', user_id: 1 });
            (companyDb.createCompany as jest.Mock).mockResolvedValue(mockCompany);

            const result = await companyService.createCompany(companyInput);

            expect(companyDb.createCompany).toHaveBeenCalledWith(companyInput);
            expect(result).toEqual(mockCompany);
        });

        it('should throw validation errors for missing fields', async () => {
            const invalidInput: Partial<CompanyInput> = {
                naam: '',
                locatie: 'Some Location',
                validationInfo: 'Info',
                user_id: 1,
            };

            await expect(companyService.createCompany(invalidInput as CompanyInput)).rejects.toThrow('Company name is required.');
        });
    });

    describe('updateCompany', () => {
        it('should update the company successfully', async () => {
            const updatedData: CompanyInput = { id: 1, naam: 'Updated Company', locatie: 'Updated Location', validationInfo: 'Valid', user_id: 1 };
            const mockUpdatedCompany = new Company({ id: 1, naam: 'Company A', locatie: 'Location A', validationInfo: 'Valid', user_id: 1, projects: [] });

            (companyDb.updateCompany as jest.Mock).mockResolvedValue(mockUpdatedCompany);

            const result = await companyService.updateCompany(1, updatedData);

            expect(companyDb.updateCompany).toHaveBeenCalledWith(1, updatedData);
            expect(result).toEqual(mockUpdatedCompany);
        });

        it('should throw an error if the company is not found', async () => {
            (companyDb.updateCompany as jest.Mock).mockResolvedValue(null);

            await expect(companyService.updateCompany(999, { naam: 'Nonexistent', locatie: 'Some Location', validationInfo: 'Info' })).rejects.toThrow('Company not found or could not be updated');
        });
     });
    
    describe('deleteCompany', () => {
        it('should delete the company if it exists', async () => {
            (companyDb.getCompanyById as jest.Mock).mockResolvedValue({ id: 1 });
            (companyDb.deleteCompany as jest.Mock).mockResolvedValue({ id: 1 });

            await companyService.deleteCompany({ id: 1 });

            expect(companyDb.getCompanyById).toHaveBeenCalledWith({ id: 1 });
            expect(companyDb.deleteCompany).toHaveBeenCalledWith({ id: 1 });
        });

        it('should throw an error if the company does not exist', async () => {
            (companyDb.getCompanyById as jest.Mock).mockResolvedValue(null);

            await expect(companyService.deleteCompany({ id: 999 })).rejects.toThrow('Company not found');
        });
    });

    describe('addProjectToCompany', () => {
        it('should add a project to the company', async () => {
            const mockCompany = new Company({ id: 1, naam: 'Company A', locatie: 'Location A', validationInfo: 'Info', user_id: 1, projects: [] });
            const projectInput: ProjectInput = {
                naam: 'New Project',
                beschrijving: 'Project Description',
                datum_voltooid: new Date('2024-01-01'),
                bedrijf_id: 1,
                categorie_id: 1,
            };
           
            (companyDb.getCompanyById as jest.Mock).mockResolvedValue(mockCompany);
            

            (companyDb.updateCompany as jest.Mock).mockResolvedValue(mockCompany);

            const result = await companyService.addProjectToCompany(1, projectInput);

            expect(companyDb.getCompanyById).toHaveBeenCalledWith({ id: 1 });
            expect(companyDb.updateCompany).toHaveBeenCalled();
            
        });

        it('should throw an error if the company does not exist', async () => {
            (companyDb.getCompanyById as jest.Mock).mockResolvedValue(null);

            await expect(companyService.addProjectToCompany(999, { naam: 'Invalid Project', beschrijving: 'Invalid', datum_voltooid: new Date(), bedrijf_id: 999, categorie_id: 999 })).rejects.toThrow('Company not found');
                
        });
    });


});
