import { ProjectRepository } from '../../repository/Project.db';
import { ProjectService } from '../../service/Project.service';
import { ProjectInput } from '../../types';

describe('ProjectService', () => {
    let projectService: ProjectService;
    let projectRepository: ProjectRepository;

    beforeEach(() => {
        projectRepository = new ProjectRepository();
        projectService = new ProjectService(projectRepository);
    });

    it('should create a project with valid data', () => {
        const projectData: ProjectInput = {
            naam: 'Project A',
            beschrijving: 'Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        };

        const project = projectService.createProject(projectData);

        expect(project.id).toBeDefined();
        expect(project.naam).toBe('Project A');
        expect(project.beschrijving).toBe('Description of Project A');
        expect(project.datum_voltooid).toEqual(new Date('2023-01-01'));
    });

    it('should throw an error if naam is empty', () => {
        const projectData: ProjectInput = {
            naam: '',
            beschrijving: 'Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        };

        expect(() => {
            projectService.createProject(projectData);
        }).toThrow('Project name is required.');
    });

    it('should throw an error if beschrijving is empty', () => {
        const projectData: ProjectInput = {
            naam: 'Project A',
            beschrijving: '',
            datum_voltooid: new Date('2023-01-01'),
        };

        expect(() => {
            projectService.createProject(projectData);
        }).toThrow('Project description is required.');
    });

    it('should throw an error if datum_voltooid is not provided', () => {
        const projectData: ProjectInput = {
            naam: 'Project A',
            beschrijving: 'Description of Project A',
            datum_voltooid: undefined,
        };

        expect(() => {
            projectService.createProject(projectData);
        }).toThrow('Project completion date is required.');
    });

    it('should update a project with valid data', () => {
        const projectData: ProjectInput = {
            naam: 'Project A',
            beschrijving: 'Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        };

        const project = projectService.createProject(projectData);

        const updatedData: Partial<ProjectInput> = {
            naam: 'Updated Project A',
            beschrijving: 'Updated Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        };

        const updatedProject = projectService.updateProject(project.id, updatedData);

        expect(updatedProject).toBeDefined();
        expect(updatedProject!.naam).toBe('Updated Project A');
        expect(updatedProject!.beschrijving).toBe('Updated Description of Project A');
    });

    it('should delete a project by id', () => {
        const projectData: ProjectInput = {
            naam: 'Project A',
            beschrijving: 'Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        };

        const project = projectService.createProject(projectData);

        projectService.deleteProject(project.id);

        const foundProject = projectService.getProjectById(project.id);
        expect(foundProject).toBeUndefined();
    });

    it('should get a project by id', () => {
        const projectData: ProjectInput = {
            naam: 'Project A',
            beschrijving: 'Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        };

        const project = projectService.createProject(projectData);

        const foundProject = projectService.getProjectById(project.id);

        expect(foundProject).toBeDefined();
        expect(foundProject!.naam).toBe('Project A');
    });

    it('should list all projects', () => {
        const projectData1: ProjectInput = {
            naam: 'Project A',
            beschrijving: 'Description of Project A',
            datum_voltooid: new Date('2023-01-01'),
        };

        const projectData2: ProjectInput = {
            naam: 'Project B',
            beschrijving: 'Description of Project B',
            datum_voltooid: new Date('2023-02-01'),
        };

        projectService.createProject(projectData1);
        projectService.createProject(projectData2);

        const projects = projectService.listProjects();

        expect(projects[0].naam).toBe('Project A');
        expect(projects[1].naam).toBe('Project B');
    });
});
