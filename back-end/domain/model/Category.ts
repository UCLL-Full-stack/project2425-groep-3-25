import { Category as CategoryPrisma, Project as ProjectPrisma } from '@prisma/client';
import { Project } from './Project';

export class Category {
    readonly id?: number;
    readonly naam: string;
    readonly beschrijving: string;
    readonly projects: Project[];

    constructor(category: {
        id?: number;
        naam: string;
        beschrijving: string;
        projects?: Project[];
    }) {
        

        this.id = category.id;
        this.naam = category.naam;
        this.beschrijving = category.beschrijving;
        this.projects = category.projects ?? [];
        this.validate(category);
    }

    private validate(category: {
        id?: number;
        naam: string;
        beschrijving: string;
    }) {
        if (!category.naam?.trim()) {
            throw new Error('Category name is required.');
        }

        if (!category.beschrijving?.trim()) {
            throw new Error('Category description is required.');
        }
    }

    // Static from method to convert Prisma object to domain model
    static from(data: CategoryPrisma & { projects: ProjectPrisma[] }): Category {
        return new Category({
            id: data.id,
            naam: data.naam,
            beschrijving: data.beschrijving,
            projects: data.projects.map(Project.from)
        });
    }
}
