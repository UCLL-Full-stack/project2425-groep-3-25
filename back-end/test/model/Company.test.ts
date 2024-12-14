import { Company } from '../../domain/model/Company';
import { Project } from '../../domain/model/Project';

describe('Company', () => {
    it('should create a company with valid data', () => {
        const project = new Project({
            id: 1,
            naam: 'Project A',
            beschrijving: 'Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        });

        const company = new Company({
            id: 1,
            naam: 'Company A',
            locatie: 'Location A',
            contact_informatie: 'contact@companya.com',
            projects: [project],
        });

        expect(company.id).toBe(1);
        expect(company.naam).toBe('Company A');
        expect(company.locatie).toBe('Location A');
        expect(company.contact_informatie).toBe('contact@companya.com');
        expect(company.projects.length).toBe(1);
        expect(company.projects[0]).toEqual(project);
    });

    it('should create a company with no projects', () => {
        const company = new Company({
            id: 1,
            naam: 'Company A',
            locatie: 'Location A',
            contact_informatie: 'contact@companya.com',
        });

        expect(company.id).toBe(1);
        expect(company.naam).toBe('Company A');
        expect(company.locatie).toBe('Location A');
        expect(company.contact_informatie).toBe('contact@companya.com');
        expect(company.projects.length).toBe(0);
    });

    it('should throw an error if naam is empty', () => {
        expect(() => {
            new Company({
                id: 1,
                naam: '',
                locatie: 'Location A',
                contact_informatie: 'contact@companya.com',
            });
        }).toThrow('Company name is required.');
    });

    it('should throw an error if locatie is empty', () => {
        expect(() => {
            new Company({
                id: 1,
                naam: 'Company A',
                locatie: '',
                contact_informatie: 'contact@companya.com',
            });
        }).toThrow('Company location is required.');
    });

    it('should throw an error if contact_informatie is empty', () => {
        expect(() => {
            new Company({
                id: 1,
                naam: 'Company A',
                locatie: 'Location A',
                contact_informatie: '',
            });
        }).toThrow('Company contact information is required.');
    });
});
