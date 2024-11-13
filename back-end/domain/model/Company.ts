import { Project } from './Project';
import { Company as CompanyPrisma, Project as ProjectPrisma } from '@prisma/client';

export class Company {
    readonly id: number;
    readonly naam: string;
    readonly locatie: string;
    readonly contact_informatie: string;
    readonly projects: Project[];

    constructor(company: {
        id: number;
        naam: string;
        locatie: string;
        contact_informatie: string;
        projects?: Project[];
    }) {
        this.validate(company);
        this.id = company.id;
        this.naam = company.naam;
        this.locatie = company.locatie;
        this.contact_informatie = company.contact_informatie;
        this.projects = company.projects ?? [];
    }

    private validate(company: {
        id: number;
        naam: string;
        locatie: string;
        contact_informatie: string;
    }) {
        if (
            !company.naam?.trim() ||
            !company.locatie?.trim() ||
            !company.contact_informatie?.trim()
        ) {
            throw new Error('All fields are required.');
        }
    }

    // Convert Prisma data to a Company instance
    static from(data: CompanyPrisma & { projects: ProjectPrisma[] }): Company {
        return new Company({
            id: data.id,
            naam: data.naam,
            locatie: data.locatie,
            contact_informatie: data.contact_informatie,
            projects: data.projects.map(Project.from),
        });
    }
}
