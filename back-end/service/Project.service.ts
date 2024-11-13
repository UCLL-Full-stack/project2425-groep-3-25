import { Project } from '../domain/model/Project';
import { ProjectInput } from '../types';
import { ProjectRepository } from '../repository/Project.db';

export class ProjectService {
    private projectRepository: ProjectRepository;

    constructor(projectRepository: ProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async createProject(projectData: ProjectInput): Promise<Project> {
        this.validateProjectData(projectData);
        return await this.projectRepository.create(projectData);
    }

    async getProjectById(id: number): Promise<Project | undefined> {
        return await this.projectRepository.findById(id);
    }

    async listProjects(): Promise<Project[]> {
        return await this.projectRepository.findAll();
    }

    async updateProject(
        id: number,
        updatedData: Partial<ProjectInput>
    ): Promise<Project | undefined> {
        this.validateProjectData(updatedData as ProjectInput);
        return await this.projectRepository.update(id, updatedData);
    }

    async deleteProject(id: number): Promise<void> {
        await this.projectRepository.delete(id);
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
