import projectService from '../../service/Project.service';
import * as projectDb from '../../repository/Project.db';
import { Project } from '../../domain/model/Project';
import { ProjectInput } from '../../types';

jest.mock('../../repository/Project.db');

describe('Project Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllProjects', () => {
        it('should return all projects', async () => {
            const projects: Project[] = [
                new Project({ id: 1, naam: 'Project A', beschrijving: 'Description A', datum_voltooid: new Date() }),
                new Project({ id: 2, naam: 'Project B', beschrijving: 'Description B', datum_voltooid: new Date() }),
            ];
            (projectDb.getAllProjects as jest.Mock).mockResolvedValue(projects);

            const result = await projectService.getAllProjects();
            expect(result).toEqual(projects);
            expect(projectDb.getAllProjects).toHaveBeenCalledTimes(1);
        });
    });

    describe('getProjectById', () => {
        it('should return a project by ID', async () => {
            const project = new Project({ id: 1, naam: 'Project A', beschrijving: 'Description A', datum_voltooid: new Date() });
            (projectDb.getProjectById as jest.Mock).mockResolvedValue(project);

            const result = await projectService.getProjectById({ id: 1 });
            expect(result).toEqual(project);
            expect(projectDb.getProjectById).toHaveBeenCalledWith({ id: 1 });
        });

        it('should throw an error if the project is not found', async () => {
            (projectDb.getProjectById as jest.Mock).mockResolvedValue(null);

            await expect(projectService.getProjectById({ id: 1 })).rejects.toThrow('Project not found');
        });
    });

    describe('createProject', () => {
        it('should create a new project', async () => {
            const projectInput: ProjectInput = {
                naam: 'Project A',
                beschrijving: 'Description A',
                datum_voltooid: new Date(),
                company_id: 1,
                category_id: 1,
            };
            const createdProject = new Project({ ...projectInput, id: 1 });
            (projectDb.createProject as jest.Mock).mockResolvedValue(createdProject);

            const result = await projectService.createProject(projectInput);
            expect(result).toEqual(createdProject);
            expect(projectDb.createProject).toHaveBeenCalledWith(projectInput);
        });

        it('should throw an error for invalid project data', async () => {
            const invalidProjectInput: ProjectInput = { naam: '', beschrijving: '', datum_voltooid: null as any, company_id: 0, category_id: 0 };

            await expect(projectService.createProject(invalidProjectInput)).rejects.toThrow('Project name is required.');
        });
    });

    describe('updateProject', () => {
        it('should update an existing project', async () => {
            const updatedData: Partial<ProjectInput> = { naam: 'Updated Project A', beschrijving: 'Description A', datum_voltooid: new Date() };
            const updatedProject = new Project({ id: 1, naam: 'Updated Project A', beschrijving: 'Description A', datum_voltooid: new Date() });
            (projectDb.updateProject as jest.Mock).mockResolvedValue(updatedProject);

            const result = await projectService.updateProject(1, updatedData);
            expect(result).toEqual(updatedProject);
            expect(projectDb.updateProject).toHaveBeenCalledWith(1, updatedData);
        });

        it('should throw an error if the project is not found', async () => {
            (projectDb.updateProject as jest.Mock).mockResolvedValue(null);

            await expect(projectService.updateProject(1, { naam: 'Updated Project A' })).rejects.toThrow('Project description is required.');
        });
    });

    describe('deleteProject', () => {
        it('should delete a project by ID', async () => {
            (projectDb.getProjectById as jest.Mock).mockResolvedValue({ id: 1 });
            (projectDb.deleteProject as jest.Mock).mockResolvedValue(undefined);

            await projectService.deleteProject({ id: 1 });
            expect(projectDb.deleteProject).toHaveBeenCalledWith({ id: 1 });
        });

        it('should throw an error if the project is not found', async () => {
            (projectDb.getProjectById as jest.Mock).mockResolvedValue(null);

            await expect(projectService.deleteProject({ id: 1 })).rejects.toThrow('Project not found');
        });
    });
});
