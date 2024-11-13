import { PrismaClient } from '@prisma/client';
import { Project } from '../domain/model/Project';
import { ProjectInput } from '../types';

const prisma = new PrismaClient();

export class ProjectRepository {
    // Create a new project in the database
    async create(projectData: ProjectInput): Promise<Project> {
        const newProjectData = await prisma.project.create({
            data: {
                naam: projectData.naam || 'Default Naam',
                beschrijving: projectData.beschrijving || 'Default Beschrijving',
                datum_voltooid: projectData.datum_voltooid || new Date(),
                company: {
                    connect: { id: projectData.company_id }, // Connect to an existing Company by ID
                },
                category: {
                    connect: { id: projectData.category_id }, // Connect to an existing Category by ID
                },
            },
        });
        return Project.from(newProjectData); // Convert Prisma object to domain model
    }

    // Find a project by its ID
    async findById(id: number): Promise<Project | undefined> {
        const projectData = await prisma.project.findUnique({
            where: { id },
        });
        return projectData ? Project.from(projectData) : undefined;
    }

    // Retrieve all projects from the database
    async findAll(): Promise<Project[]> {
        const projectsData = await prisma.project.findMany();
        return projectsData.map((project) => Project.from(project));
    }

    // Update a project in the database
    async update(id: number, updatedData: Partial<ProjectInput>): Promise<Project | undefined> {
        const projectExists = await prisma.project.findUnique({ where: { id } });
        if (!projectExists) return undefined;

        const updatedProjectData = await prisma.project.update({
            where: { id },
            data: {
                naam: updatedData.naam,
                beschrijving: updatedData.beschrijving,
                datum_voltooid: updatedData.datum_voltooid,
                company: updatedData.company_id
                    ? { connect: { id: updatedData.company_id } }
                    : undefined,
                category: updatedData.category_id
                    ? { connect: { id: updatedData.category_id } }
                    : undefined,
            },
        });
        return Project.from(updatedProjectData);
    }

    // Delete a project from the database
    async delete(id: number): Promise<void> {
        await prisma.project.delete({
            where: { id },
        });
    }
}
