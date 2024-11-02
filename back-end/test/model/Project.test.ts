import { Project } from '../../domain/model/Project';

describe('Project', () => {
    it('should create a project with valid data', () => {
        const project = new Project({
            id: 1,
            naam: 'Project A',
            beschrijving: 'Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        });

        expect(project.id).toBe(1);
        expect(project.naam).toBe('Project A');
        expect(project.beschrijving).toBe('Description of Project A');
        expect(project.datum_voltooid).toEqual(new Date('2023-01-01'));
    });

    it('should throw an error if naam is empty', () => {
        expect(() => {
            new Project({
                id: 1,
                naam: '',
                beschrijving: 'Description of Project A',
                datum_voltooid: new Date('2023-01-01'),
            });
        }).toThrow('All fields are required.');
    });

    it('should throw an error if beschrijving is empty', () => {
        expect(() => {
            new Project({
                id: 1,
                naam: 'Project A',
                beschrijving: '',
                datum_voltooid: new Date('2023-01-01'),
            });
        }).toThrow('All fields are required.');
    });
});
