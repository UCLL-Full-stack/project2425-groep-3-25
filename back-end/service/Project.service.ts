import { Project } from '../domain/model/Project';
import { ProjectInput } from '../types';
import { ProjectRepository } from '../repository/Project.db';

export class ProjectService {
    private projectRepository: ProjectRepository;

    constructor(projectRepository: ProjectRepository) {
        this.projectRepository = projectRepository;
    }

    createProject(projectData: ProjectInput): Project {
        this.validateProjectData(projectData);
        return this.projectRepository.create(projectData);
    }

    getProjectById(id: number): Project | undefined {
        return this.projectRepository.findById(id);
    }

    listProjects(): Project[] {
        return this.projectRepository.findAll();
    }

    updateProject(id: number, updatedData: Partial<ProjectInput>): Project | undefined {
        this.validateProjectData(updatedData as ProjectInput);
        return this.projectRepository.update(id, updatedData);
    }

    deleteProject(id: number): void {
        this.projectRepository.delete(id);
    }

    private validateProjectData(projectData: ProjectInput): void {
        if (!projectData.naam?.trim()) {
            throw new Error('Project name is required.');
        }
        if (!projectData.beschrijving?.trim()) {
            throw new Error('Project description is required.');
        }
        if (!projectData.datum_voltooid) {
            throw new Error('Project completion date is required.');
        }
    }
}
