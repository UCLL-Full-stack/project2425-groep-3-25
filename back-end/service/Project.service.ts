import { Project } from '../domain/model/Project';
import * as projectDb from '../repository/Project.db';
import { ProjectInput } from '../types';

const getAllProjects = async (): Promise<Project[]> => {
    return await projectDb.getAllProjects();
};

const getProjectById = async ({ id }: { id: number }): Promise<Project | null> => {
    const project = await projectDb.getProjectById({ id });
    if (!project) {
        throw new Error('Project not found');
    }
    return project;
};

const createProject = async (projectData: ProjectInput): Promise<Project> => {
    validateProjectData(projectData);
    return await projectDb.createProject(projectData);
};

const updateProject = async (
    id: number,
    updatedData: Partial<ProjectInput>
): Promise<Project | null> => {
    validateProjectData(updatedData as ProjectInput);
    const updatedProject = await projectDb.updateProject(id, updatedData);
    if (!updatedProject) {
        throw new Error('Project not found or could not be updated');
    }
    return updatedProject;
};

const deleteProject = async ({ id }: { id: number }): Promise<void> => {
    const projectExists = await projectDb.getProjectById({ id });
    if (!projectExists) {
        throw new Error('Project not found');
    }
    await projectDb.deleteProject({ id });
};

const validateProjectData = (projectData: ProjectInput): void => {
    if (!projectData.naam?.trim()) {
        throw new Error('Project name is required.');
    }
    if (!projectData.beschrijving?.trim()) {
        throw new Error('Project description is required.');
    }
    if (!projectData.datum_voltooid) {
        throw new Error('Project completion date is required.');
    }
};

export default {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};
