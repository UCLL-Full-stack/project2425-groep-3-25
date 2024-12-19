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

const getProjectById = async ({
  id,
}: {
  id: number;
}): Promise<Project | null> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });
    return project ? Project.from(project) : null;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while finding the project by ID');
  }
};

const getAllProjects = async (): Promise<Project[]> => {
  try {
    const projects = await prisma.project.findMany();
    return projects.map(Project.from);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while retrieving all projects');
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
        datum_voltooid: updatedData.datum_voltooid,
        company: updatedData.bedrijf_id
          ? { connect: { id: updatedData.bedrijf_id } }
          : undefined,
        category: updatedData.categorie_id
          ? { connect: { id: updatedData.categorie_id } }
          : undefined,
      },
    });
    return Project.from(updatedProject);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while updating the project');
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
