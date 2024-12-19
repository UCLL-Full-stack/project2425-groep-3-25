import express, { NextFunction, Request, Response } from 'express';
import projectService from '../service/Project.service';
import companyService from '../service/Company.service';
import { ProjectInput } from '../types';
import jwt  from 'jsonwebtoken';

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}
/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management endpoints
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of all projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await projectService.getAllProjects();
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = parseInt(req.params.id, 10);
        const project = await projectService.getProjectById({ id: projectId });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /projects:
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
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized. Token is required." });
    }

    // Decode token to extract email
    const jwtSecret = process.env.JWT_SECRET || "default_secret";
    const decoded = jwt.verify(token, jwtSecret) as { email: string };

    if (!decoded.email) {
      return res.status(401).json({ error: "Invalid token." });
    }

    const projectData = req.body;

    // Create the project
    const newProject = await projectService.createProject(projectData, decoded.email);
    res.status(201).json(newProject);
  } catch (error) {
    next(error);
  }
});
/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update an existing project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = parseInt(req.params.id, 10);
        const updatedData: Partial<ProjectInput> = req.body;
        const updatedProject = await projectService.updateProject(projectId, updatedData);
        if (!updatedProject) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.status(200).json(updatedProject);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID
 *     responses:
 *       204:
 *         description: Project deleted successfully
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = parseInt(req.params.id, 10);
        await projectService.deleteProject({ id: projectId });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
