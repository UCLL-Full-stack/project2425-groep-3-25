import { PrismaClient } from '@prisma/client';
import { Project } from '../domain/model/Project';
import { ProjectInput } from '../types';
import company from '../domain/model/Company'

const prisma = new PrismaClient();

const createProject = async ({
  naam,
  beschrijving,
  datum_voltooid,
  company_id,
  category_id,
}: ProjectInput): Promise<Project> => {
  try {
    const newProject = await prisma.project.create({
      data: {
        naam: naam || 'Default Naam',
        beschrijving: beschrijving || 'Default Beschrijving',
        datum_voltooid: datum_voltooid || new Date(),
        company: {
          connect: { id: company_id },
        },
        category: {
          connect: { id: category_id },
        },
      },
    });
    return Project.from(newProject);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while creating the project');
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
        company: updatedData.company_id
          ? { connect: { id: updatedData.company_id } }
          : undefined,
        category: updatedData.category_id
          ? { connect: { id: updatedData.category_id } }
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
