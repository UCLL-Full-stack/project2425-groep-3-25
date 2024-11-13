import { PrismaClient } from '@prisma/client';
import { Company } from '../domain/model/Company';
import { CompanyInput } from '../types';
import { Project } from '../domain/model/Project';

const prisma = new PrismaClient();

export class CompanyRepository {
    // Create a new company in the database
    async create(companyData: CompanyInput): Promise<Company> {
        const newCompany = await prisma.company.create({
            data: {
                naam: companyData.naam || '',
                locatie: companyData.locatie || '',
                contact_informatie: companyData.contact_informatie || '',
                projects: {
                    create:
                        companyData.projects?.map((project) => ({
                            naam: project.naam || '',
                            beschrijving: project.beschrijving || '',
                            datum_voltooid: project.datum_voltooid || new Date(),
                            category: {
                                connect: { id: project.category_id }, // Connect the project to an existing category by ID
                            },
                        })) || [],
                },
            },
            include: { projects: true }, // Include related projects in the result
        });

        return Company.from(newCompany); // Convert Prisma object to domain model
    }

    // Find a company by its ID
    async findById(id: number): Promise<Company | undefined> {
        const companyData = await prisma.company.findUnique({
            where: { id },
            include: { projects: true },
        });

        return companyData ? Company.from(companyData) : undefined;
    }

    // Retrieve all companies from the database
    async findAll(): Promise<Company[]> {
        const companiesData = await prisma.company.findMany({
            include: { projects: true },
        });

        return companiesData.map((company) => Company.from(company));
    }

    // Update a company in the database
    async update(id: number, updatedData: Partial<CompanyInput>): Promise<Company | undefined> {
        const companyExists = await prisma.company.findUnique({ where: { id } });
        if (!companyExists) return undefined;

        const updatedCompanyData = await prisma.company.update({
            where: { id },
            data: {
                naam: updatedData.naam,
                locatie: updatedData.locatie,
                contact_informatie: updatedData.contact_informatie,
                projects: {
                    deleteMany: {}, // Clear existing projects before updating
                    create:
                        updatedData.projects?.map((project) => ({
                            naam: project.naam,
                            beschrijving: project.beschrijving,
                            datum_voltooid: project.datum_voltooid || new Date(),
                            category: {
                                connect: { id: project.category_id }, // Connect the project to an existing category by ID
                            },
                        })) || [],
                },
            },
            include: { projects: true }, // Include projects in the updated data
        });

        return Company.from(updatedCompanyData);
    }

    // Delete a company from the database
    async delete(id: number): Promise<void> {
        await prisma.company.delete({
            where: { id },
        });
    }
}
