import express, { NextFunction, Request, Response } from 'express';
import companyService from '../service/Company.service';
import { CompanyInput, ProjectInput } from '../types';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company management endpoints
 */

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: List of all companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CompanyInput'
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companies = await companyService.getAllCompanies();
        res.status(200).json(companies);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The company ID
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyInput'
 *       404:
 *         description: Company not found
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyId = parseInt(req.params.id, 10);
        const company = await companyService.getCompanyById({ id: companyId });
        if (!company) {
            res.status(404).json({ error: 'Company not found' });
            return;
        }
        res.status(200).json(company);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyInput'
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyInput'
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyInput: CompanyInput = req.body;
        const newCompany = await companyService.createCompany(companyInput);
        res.status(201).json(newCompany);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /companies/{id}/projects:
 *   post:
 *     summary: Add a project to an existing company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: Project added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyInput'
 *       404:
 *         description: Company not found
 */
router.post('/:id/projects', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyId = parseInt(req.params.id, 10);
        const projectInput: ProjectInput = req.body;
        const updatedCompany = await companyService.addProjectToCompany(companyId, projectInput);
        res.status(200).json(updatedCompany);
    } catch (error) {
        next(error);
    }
});

export default router;
