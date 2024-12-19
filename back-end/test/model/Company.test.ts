import { Company } from '../../domain/model/Company';
import { Project } from '../../domain/model/Project';

describe('Company', () => {
    it('should create a company with valid data', () => {
        const company = new Company({
            id: 1,
            naam: 'Tech Corp',
            locatie: 'San Francisco',
            validationInfo: 'Contact us at techcorp@example.com',
            user_id: 42,
            projects: [
                new Project({
                    id: 1,
                    bedrijf_id: 1,
                    categorie_id: 1,
                    naam: 'Project Alpha',
                    beschrijving: 'First project',
                    datum_voltooid: new Date('2024-01-01'),
                }),
            ],
        });

        expect(company.id).toBe(1);
        expect(company.naam).toBe('Tech Corp');
        expect(company.locatie).toBe('San Francisco');
        expect(company.validationInfo).toBe('Contact us at techcorp@example.com');
        expect(company.user_id).toBe(42);
        expect(company.projects.length).toBe(1);
        expect(company.projects[0].naam).toBe('Project Alpha');
    });

    it('should throw an error if naam is empty', () => {
        expect(() => {
            new Company({
                id: 1,
                naam: '',
                locatie: 'San Francisco',
                validationInfo: 'Contact us at techcorp@example.com',
                user_id: 42,
                projects: [],
            });
        }).toThrow('Company name is required.');
    });

    it('should throw an error if locatie is empty', () => {
        expect(() => {
            new Company({
                id: 1,
                naam: 'Tech Corp',
                locatie: '',
                validationInfo: 'Contact us at techcorp@example.com',
                user_id: 42,
                projects: [],
            });
        }).toThrow('Company location is required.');
    });

    it('should throw an error if validationInfo is empty', () => {
        expect(() => {
            new Company({
                id: 1,
                naam: 'Tech Corp',
                locatie: 'San Francisco',
                validationInfo: '',
                user_id: 42,
                projects: [],
            });
        }).toThrow('Company contact information is required.');
    });

    it('should default to an empty array if no projects are provided', () => {
        const company = new Company({
            id: 1,
            naam: 'Tech Corp',
            locatie: 'San Francisco',
            validationInfo: 'Contact us at techcorp@example.com',
            user_id: 42,
        });

        expect(company.projects).toEqual([]);
    });

    it('should correctly map Prisma object to domain model using the static from method', () => {
        const prismaCompany = {
            id: 1,
            naam: 'Tech Corp',
            locatie: 'San Francisco',
            validationInfo: 'Contact us at techcorp@example.com',
            user_id: 42,
            projects: [
                {
                    id: 1,
                    bedrijf_id: 1,
                    categorie_id: 1,
                    naam: 'Project Alpha',
                    beschrijving: 'First project',
                    datum_voltooid: new Date('2024-01-01'),
                },
            ],
        };

        const company = Company.from(prismaCompany);

        expect(company.id).toBe(1);
        expect(company.naam).toBe('Tech Corp');
        expect(company.locatie).toBe('San Francisco');
        expect(company.validationInfo).toBe('Contact us at techcorp@example.com');
        expect(company.user_id).toBe(42);
        expect(company.projects.length).toBe(1);
        expect(company.projects[0].naam).toBe('Project Alpha');
    });
});
