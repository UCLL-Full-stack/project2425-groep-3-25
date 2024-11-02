import { Project } from '../domain/model/Project';
import { ProjectInput } from '../types';

export class ProjectRepository {
    private projects: Project[] = [];

    constructor() {
        // Voeg hier dummy data toe voor testdoeleinden
        this.projects = [
            new Project({
                id: 1,
                naam: 'Project A',
                beschrijving: 'Description of Project A',
                datum_voltooid: new Date('2023-01-01'),
            }),
            new Project({
                id: 2,
                naam: 'Project B',
                beschrijving: 'Description of Project B',
                datum_voltooid: new Date('2023-02-01'),
            }),
        ];
    }

    create(projectData: ProjectInput): Project {
        const newProject = new Project({
            id: this.generateId(),
            naam: projectData.naam || 'Default Naam',
            beschrijving: projectData.beschrijving || 'Default Beschrijving',
            datum_voltooid: projectData.datum_voltooid || new Date(),
        });
        this.projects.push(newProject);
        return newProject;
    }

    findById(id: number): Project | undefined {
        return this.projects.find((project) => project.id === id);
    }

    findAll(): Project[] {
        return this.projects;
    }

    update(id: number, updatedData: Partial<ProjectInput>): Project | undefined {
        const project = this.findById(id);
        if (!project) {
            return undefined;
        }

        const updatedProject = new Project({
            ...project,
            ...updatedData,
            id: project.id, // Zorg ervoor dat de id hetzelfde blijft
        });

        this.projects = this.projects.map((p) => (p.id === id ? updatedProject : p));
        return updatedProject;
    }

    delete(id: number): void {
        this.projects = this.projects.filter((project) => project.id !== id);
    }

    private generateId(): number {
        return this.projects.length > 0 ? Math.max(...this.projects.map((p) => p.id)) + 1 : 1;
    }
}
