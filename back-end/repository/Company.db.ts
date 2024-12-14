import { PrismaClient } from '@prisma/client';
import { Company } from '../domain/model/Company';
import { CompanyInput } from '../types';
import { Project } from '../domain/model/Project';

const prisma = new PrismaClient();

const createCompany = async ({
  naam,
  locatie,
  contact_informatie,
  projects,
}: CompanyInput): Promise<Company> => {
  try {
    const newCompany = await prisma.company.create({
      data: {
        naam: naam || '',
        locatie: locatie || '',
        contact_informatie: contact_informatie || '',
        projects: {
          create: projects?.map((project) => ({
            naam: project.naam || '',
            beschrijving: project.beschrijving || '',
            datum_voltooid: project.datum_voltooid || new Date(),
            category: {
              connect: { id: project.category_id },
            },
          })) || [],
        },
      },
      include: { projects: true },
    });
    return Company.from(newCompany);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while creating the company');
  }
};

const getCompanyById = async ({
  id,
}: {
  id: number;
}): Promise<Company | null> => {
  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: { projects: true },
    });
    return company ? Company.from(company) : null;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while finding the company by ID');
  }
};

const getAllCompanies = async (): Promise<Company[]> => {
  try {
    const companies = await prisma.company.findMany({
      include: { projects: true },
    });
    return companies.map(Company.from);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while retrieving all companies');
  }
};

const updateCompany = async (
  id: number,
  updatedData: Partial<CompanyInput>
): Promise<Company | null> => {
  try {
    const companyExists = await prisma.company.findUnique({ where: { id } });
    if (!companyExists) return null;

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        naam: updatedData.naam,
        locatie: updatedData.locatie,
        contact_informatie: updatedData.contact_informatie,
        projects: {
          deleteMany: {}, // Clear existing projects before updating
          create: updatedData.projects?.map((project) => ({
            naam: project.naam,
            beschrijving: project.beschrijving,
            datum_voltooid: project.datum_voltooid || new Date(),
            category: {
              connect: { id: project.category_id },
            },
          })) || [],
        },
      },
      include: { projects: true },
    });
    return Company.from(updatedCompany);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while updating the company');
  }
};

const deleteCompany = async ({
  id,
}: {
  id: number;
}): Promise<void> => {
  try {
    await prisma.company.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while deleting the company');
  }
};

export {
  createCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
  deleteCompany,
};
