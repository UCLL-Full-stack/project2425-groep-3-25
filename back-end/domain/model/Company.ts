import { Project } from './Project';
import { Company as CompanyPrisma, Project as ProjectPrisma } from '@prisma/client';

export class Company {
    readonly id?: number;
    readonly naam: string;
    readonly locatie: string;
    readonly validationInfo: string;
    readonly user_id: number;
    readonly projects: Project[];

    constructor(company: {
        id?: number;
        naam: string;
        locatie: string;
        validationInfo: string;
        user_id: number ;
        projects?: Project[];
    }) {
        this.id = company.id;
        this.naam = company.naam;
        this.locatie = company.locatie;
        this.validationInfo = company.validationInfo;
        this.projects = company.projects ?? [];
        this.user_id = company.user_id;

        // Validate after properties are set
        this.validate();
    }

    // Validate the object
    private validate() {
        if (!this.naam?.trim()) {
            throw new Error('Company name is required.');
        }

        if (!this.locatie?.trim()) {
            throw new Error('Company location is required.');
        }

        if (!this.validationInfo?.trim()) {
            throw new Error('Company contact information is required.');
        }
    }

    // Static from method to convert Prisma object to domain model
    static from(data: CompanyPrisma & { projects: ProjectPrisma[] }): Company {
        // Use the constructor to ensure validation
        return new Company({
            id: data.id,
            naam: data.naam,
            locatie: data.locatie,
            validationInfo: data.validationInfo,
            user_id: data.user_id,
            projects: data.projects.map(Project.from), // Map projects using the Project class's from method
        });
    }


}

export default Company;
