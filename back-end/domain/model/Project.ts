import { Project as ProjectPrisma } from '@prisma/client';

export class Project {
    readonly id?: number;
    readonly naam: string;
    readonly beschrijving: string;
    readonly datum_voltooid: Date;

    constructor(project: {
        id?: number;
        naam: string;
        beschrijving: string;
        datum_voltooid: Date;
    }) {
        this.validate(project);

        this.id = project.id;
        this.naam = project.naam;
        this.beschrijving = project.beschrijving;
        this.datum_voltooid = project.datum_voltooid;
    }

    private validate(project: {
        id?: number;
        naam: string;
        beschrijving: string;
        datum_voltooid: Date;
    }) {
        if (!project.naam?.trim()) {
            throw new Error('Project name is required.');
        }

        if (!project.beschrijving?.trim()) {
            throw new Error('Project description is required.');
        }

        if (!project.datum_voltooid) {
            throw new Error('Completion date is required.');
        }
    }

    // Static from method to convert Prisma object to domain model
    static from(data: ProjectPrisma): Project {
        return new Project({
            id: data.id,
            naam: data.naam,
            beschrijving: data.beschrijving,
            datum_voltooid: data.datum_voltooid,
        });
    }
}
