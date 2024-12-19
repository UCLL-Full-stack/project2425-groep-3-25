import projectService from '../../service/Project.service'; 
import * as projectDb from '../../repository/Project.db';
import { Project } from '../../domain/model/Project';


jest.mock('../../repository/Project.db');

describe('Project Service Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllProjects', () => {
        it('should return all projects', async () => {
            const mockProjects = [
                new Project({ id: 1, naam: 'Project A', beschrijving: 'Description A', datum_voltooid: new Date('2024-01-01'), categorie_id: 1, bedrijf_id: 1 }),
            ];
            (projectDb.getAllProjects as jest.Mock).mockResolvedValue(mockProjects);

            const result = await projectService.getAllProjects();

            expect(projectDb.getAllProjects).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockProjects);
        });
    });

    describe('getProjectById', () => {
        it('should return the correct project', async () => {
            const mockProject = new Project({ id: 1, naam: 'Project A', beschrijving: 'Description A', datum_voltooid: new Date('2024-01-01'), categorie_id: 1, bedrijf_id: 1 });
            (projectDb.getProjectById as jest.Mock).mockResolvedValue(mockProject);

            const result = await projectService.getProjectById({ id: 1 });

            expect(projectDb.getProjectById).toHaveBeenCalledWith({ id: 1 });
            expect(result).toEqual(mockProject);
        });

        it('should throw an error if the project does not exist', async () => {
            (projectDb.getProjectById as jest.Mock).mockResolvedValue(null);

            await expect(projectService.getProjectById({ id: 999 })).rejects.toThrow('Project not found');
        });
    });

    describe('createProject', () => {
        it('should create a project', async () => {
            const projectInput = {

                naam: 'New Project',

                beschrijving: 'Project Description',

                datum_voltooid: new Date('2024-01-01'),

                categoryName: 'Category A',

                bedrijf_id: 1, 

            };

            const mockProject = new Project({ id: 1, ...projectInput, categorie_id: 1, bedrijf_id: 1 });
            (projectDb.createProject as jest.Mock).mockResolvedValue(mockProject);

            const result = await projectService.createProject(projectInput, 'test@example.com');

            expect(projectDb.createProject).toHaveBeenCalledWith(projectInput, 'test@example.com');
            expect(result).toEqual(mockProject);
        });

        it('should throw an error for missing fields', async () => {
            const invalidInput = {
                naam: '',
                beschrijving: 'Description',
                datum_voltooid: '',
                categoryName: '',
            };

            await expect(projectService.createProject(invalidInput as any, 'test@example.com')).rejects.toThrow(
                'All fields (name, description, date, and category) are required.'
            );
        });
    });

    describe('updateProject', () => {
        it('should update the project successfully', async () => {
            const updatedData = { naam: 'Updated Project', beschrijving: 'Updated Description' };
            const mockUpdatedProject = new Project({ id: 1, ...updatedData, datum_voltooid: new Date('2024-01-01'), categorie_id: 1, bedrijf_id: 1 });

            (projectDb.updateProject as jest.Mock).mockResolvedValue(mockUpdatedProject);

            const result = await projectService.updateProject(1, updatedData);

            expect(projectDb.updateProject).toHaveBeenCalledWith(1, updatedData);
            expect(result).toEqual(mockUpdatedProject);
        });

        it('should throw an error for invalid input', async () => {
            const invalidInput = { naam: '', beschrijving: '' };

            await expect(projectService.updateProject(1, invalidInput)).rejects.toThrow('Invalid input for updating the project.');
        });
    });

    describe('deleteProject', () => {
        it('should delete the project if it exists', async () => {
            (projectDb.getProjectById as jest.Mock).mockResolvedValue({ id: 1 });
            (projectDb.deleteProject as jest.Mock).mockResolvedValue({ id: 1 });

            await projectService.deleteProject({ id: 1 });

            expect(projectDb.getProjectById).toHaveBeenCalledWith({ id: 1 });
            expect(projectDb.deleteProject).toHaveBeenCalledWith({ id: 1 });
        });

        it('should throw an error if the project does not exist', async () => {
            (projectDb.getProjectById as jest.Mock).mockResolvedValue(null);

            await expect(projectService.deleteProject({ id: 999 })).rejects.toThrow('Project not found');
        });
    });
});
