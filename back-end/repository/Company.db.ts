import { PrismaClient } from '@prisma/client';
import { Company } from '../domain/model/Company';
import { CompanyInput } from '../types';
import { Project } from '../domain/model/Project';

const prisma = new PrismaClient();

const createCompany = async (companyData: CompanyInput): Promise<Company> => {
  const { naam, locatie, validationInfo, user_id } = companyData;

  if (!user_id) {
    throw new Error('User ID is required to create a company.');
  }

  const newCompany = await prisma.company.create({
    data: {
      naam,
      locatie,
      validationInfo: validationInfo || '',
      user: { connect: { id: user_id } }, // Link user to company
    },
    include: { projects: true }, // Include related projects if needed
  });

  console.log('Created Company:', newCompany); // Debugging
  return Company.from(newCompany);
};


const getCompanyByUserId = async (userId: number): Promise<Company | null> => {
  try {
    const company = await prisma.company.findUnique({
      where: { user_id: userId },
      include: { projects: true },
    });

    if (!company) {
      console.error(`No company found for user_id: ${userId}`);
      throw new Error('Company not found.');
    }

    return Company.from(company);
  } catch (error) {
    console.error('Error fetching company by user ID:', error);
    throw new Error('Could not fetch company by user ID.');
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
        validationInfo: updatedData.validationInfo,
        projects: {
          deleteMany: {}, // Clear existing projects before updating
          create: updatedData.projects?.map((project) => ({
            naam: project.naam,
            beschrijving: project.beschrijving,
            datum_voltooid: project.datum_voltooid || new Date(),
            category: {
              connect: { id: project.categorie_id },
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
  getCompanyByUserId,
};
