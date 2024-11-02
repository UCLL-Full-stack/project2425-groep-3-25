import express, { Request, Response } from 'express';
import { ProjectService } from '../service/Project.service';
import { ProjectRepository } from '../repository/Project.db';
import { ProjectInput } from '../types';

const router = express.Router();
const projectRepository = new ProjectRepository();
const projectService = new ProjectService(projectRepository);

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectInput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         naam:
 *           type: string
 *         beschrijving:
 *           type: string
 *         datum_voltooid:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       201:
 *         description: The created project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectInput'
 *       500:
 *         description: Internal Server Error
 */
router.post('/projects', (req: Request, res: Response) => {
    try {
        const projectData: ProjectInput = req.body;
        const newProject = projectService.createProject(projectData);
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The project ID
 *     responses:
 *       200:
 *         description: The project data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectInput'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/projects/:id', (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.id, 10);
        const project = projectService.getProjectById(projectId);
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

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update an existing project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: The updated project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectInput'
 *       500:
 *         description: Internal Server Error
 */
router.put('/projects/:id', (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.id, 10);
        const updatedData: Partial<ProjectInput> = req.body;
        const updatedProject = projectService.updateProject(projectId, updatedData);
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The project ID
 *     responses:
 *       204:
 *         description: No Content
 *       500:
 *         description: Internal Server Error
 */
router.delete('/projects/:id', (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.id, 10);
        projectService.deleteProject(projectId);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: List all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectInput'
 *       500:
 *         description: Internal Server Error
 */
router.get('/projects', (req: Request, res: Response) => {
    try {
        const projects = projectService.listProjects();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error listing projects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
