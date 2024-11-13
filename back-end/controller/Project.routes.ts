import express, { Request, Response } from 'express';
import { ProjectService } from '../service/Project.service';
import { ProjectRepository } from '../repository/Project.db';
import { ProjectInput } from '../types';

const router = express.Router();
const projectRepository = new ProjectRepository();
const projectService = new ProjectService(projectRepository);

// Create a new project
router.post('/projects', async (req: Request, res: Response) => {
    try {
        const projectData: ProjectInput = req.body;
        const newProject = await projectService.createProject(projectData);
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a project by ID
router.get('/projects/:id', async (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.id, 10);
        const project = await projectService.getProjectById(projectId);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.status(200).json(project);
    } catch (error) {
        console.error('Error getting project by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update an existing project
router.put('/projects/:id', async (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.id, 10);
        const updatedData: Partial<ProjectInput> = req.body;
        const updatedProject = await projectService.updateProject(projectId, updatedData);
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a project by ID
router.delete('/projects/:id', async (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.id, 10);
        await projectService.deleteProject(projectId);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// List all projects
router.get('/projects', async (req: Request, res: Response) => {
    try {
        const projects = await projectService.listProjects();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error listing projects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
