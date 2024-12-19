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


const getCompanyById = async ({ id }: { id: number }): Promise<Company | null> => {
  console.log('Repository - Received id:', id); // Debugging

  if (!id) {
    throw new Error('Company ID is required.');
  }

  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: { projects: true },
    });

    console.log('Repository - Company found:', company); // Debugging
    return company ? Company.from(company) : null;
  } catch (error) {
    console.error('Error fetching company by ID:', error);
    throw new Error('Failed to retrieve company.');
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
export const addEmployeeToCompany = async (companyId: number, userEmail: string, telefoonnummer: string) => {
  // Validate that the user exists and doesn't already have an employee record
  const existingUser = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { employee: true },
  });

  if (!existingUser) {
    throw new Error("User not found.");
  }

  if (existingUser.employee) {
    throw new Error("User is already assigned as an employee.");
  }

  // Create the employee and associate it with the company
  const newEmployee = await prisma.employee.create({
    data: {
      naam: `${existingUser.firstName} ${existingUser.lastName}`,
      email: existingUser.email,
      telefoonnummer,
      bedrijf_id: companyId,
      user_id: existingUser.id,
    },
  });

  return newEmployee;
};

// export const getEmployeesByCompanyId = async (companyId: number) => {
//   if (!companyId) {
//     console.error('Repository - companyId is undefined or null');
//     throw new Error('Company ID is required in the repository.');
//   }

//   console.log('Repository - Fetching employees for companyId:', companyId); // Debugging
//   return await prisma.employee.findMany({
//     where: { bedrijf_id: companyId },
//     include: { user: true },
//   });
// };

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
