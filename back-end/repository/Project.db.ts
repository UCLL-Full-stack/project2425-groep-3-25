import { PrismaClient } from '@prisma/client';
import { Project } from '../domain/model/Project';
import { ProjectInput } from '../types';
import company from '../domain/model/Company'

const prisma = new PrismaClient();

interface ProjectInputWithCategoryName extends Omit<ProjectInput, "categorie_id"> {
  categoryName: string; // Accept category name instead of ID
}

const createProject = async (projectData: ProjectInputWithCategoryName, email: string) => {
  const { naam, beschrijving, datum_voltooid, categoryName } = projectData;

  try {
    // Find the company associated with the user's email
    const company = await prisma.company.findFirst({
      where: {
        user: {
          email: email, // Match user email
        },
      },
    });

    if (!company) {
      throw new Error("Company not found for the logged-in user.");
    }

    // Find the category by name
    const category = await prisma.category.findFirst({
      where: { naam: categoryName },
    });

    if (!category) {
      throw new Error("Category not found. Please provide a valid category name.");
    }

    // Create the project with resolved company and category IDs
    const newProject = await prisma.project.create({
      data: {
        naam,
        beschrijving,
        datum_voltooid: new Date(datum_voltooid),
        bedrijf_id: company.id,   // Automatically set the company ID
        categorie_id: category.id, // Resolved category ID
      },
    });

    return newProject;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project.");
  }
};

const getProjectById = async ({ id }: { id: number }): Promise<Project | null> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        employeeProjects: {
          include: {
            employee: true,
          },
        },
        category: true, // Include category details
      },
    });

    if (project) {
      const projectWithEmployees = {
        ...Project.from(project),
        employees: project.employeeProjects.map((ep) => ep.employee),
        category: project.category ? { id: project.category.id, naam: project.category.naam } : undefined,
      };
      return Object.assign(new Project(project), projectWithEmployees);
    }
    return null;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw new Error("An error occurred while retrieving the project.");
  }
};

const getAllProjects = async (): Promise<Project[]> => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        employeeProjects: {
          include: {
            employee: true, // Include the employee details
          },
        },
        category: true, // Include category details
      },
    });

    return projects.map((project) => {
      const employees = project.employeeProjects.map((ep) => ep.employee);
      const category = project.category ? { id: project.category.id, naam: project.category.naam } : undefined;
      const projectWithEmployees = {
        ...Project.from(project),
        employees,
        category,// Add employees to the response
      };
      return Object.assign(new Project(project), projectWithEmployees);
    });
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while retrieving all projects");
  }
};


const updateProject = async (
  id: number,
  updatedData: Partial<ProjectInput>
): Promise<Project | null> => {
  try {
    const projectExists = await prisma.project.findUnique({
      where: { id },
    });

    if (!projectExists) return null;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        naam: updatedData.naam,
        beschrijving: updatedData.beschrijving,
        datum_voltooid: updatedData.datum_voltooid
          ? new Date(updatedData.datum_voltooid)
          : undefined,
        categorie_id: updatedData.categorie_id, // Directly update the category ID
      },
      include: {
        category: true, // Include category in the updated response
      },
    });

    return Project.from(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("An error occurred while updating the project.");
  }
};


const deleteProject = async ({
  id,
}: {
  id: number;
}): Promise<void> => {
  try {
    await prisma.project.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while deleting the project');
  }
};

export {
  createProject,
  getProjectById,
  getAllProjects,
  updateProject,
  deleteProject,
};
