import { ProjectService } from '../../service/Project.service';
import { ProjectRepository } from '../../repository/Project.db';
import { ProjectInput } from '../../types';

jest.mock('../../repository/Project.db'); // Mock the ProjectRepository

describe('ProjectService', () => {
    let projectService: ProjectService;
    let projectRepository: jest.Mocked<ProjectRepository>;

    beforeEach(() => {
        projectRepository = new ProjectRepository() as jest.Mocked<ProjectRepository>;
        projectService = new ProjectService(projectRepository);
    });

    it('should create a project with valid data', async () => {
        const projectData: ProjectInput = {
            naam: 'Project A',
            beschrijving: 'Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        };

        // Mock the repository method
        projectRepository.create.mockResolvedValue({ ...projectData, id: 1 });

        const project = await projectService.createProject(projectData);

        expect(project.id).toBeDefined();
        expect(project.naam).toBe('Project A');
        expect(project.beschrijving).toBe('Description of Project A');
        expect(project.datum_voltooid).toEqual(new Date('2023-01-01'));
    });

    it('should throw an error if naam is empty', async () => {
        const projectData: ProjectInput = {
            naam: '',
            beschrijving: 'Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        };

        await expect(projectService.createProject(projectData)).rejects.toThrow(
            'Project name is required.'
        );
    });

    it('should delete a project by id', async () => {
        // Mock the repository method
        projectRepository.delete.mockResolvedValue(undefined);

        await expect(projectService.deleteProject(1)).resolves.toBeUndefined();
    });
});
