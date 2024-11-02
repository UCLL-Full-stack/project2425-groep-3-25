import express, { Request, Response } from 'express';
import { CompanyService } from '../service/Company.service';
import { CompanyRepository } from '../repository/Company.db';
import { CompanyInput, ProjectInput } from '../types';

const router = express.Router();
const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);

/**
 * @swagger
 * components:
 *   schemas:
 *     CompanyInput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         naam:
 *           type: string
 *         locatie:
 *           type: string
 *         contact_informatie:
 *           type: string
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProjectInput'
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
 * /api/companies:
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
 *         description: The created company
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyInput'
 *       500:
 *         description: Internal Server Error
 */
router.post('/companies', (req: Request, res: Response) => {
    try {
        const companyData: CompanyInput = req.body;
        const newCompany = companyService.createCompany(companyData);
        res.status(201).json(newCompany);
    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: List all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CompanyInput'
 *       500:
 *         description: Internal Server Error
 */
router.get('/companies', (req: Request, res: Response) => {
    try {
        const companies = companyService.listCompanies();
        res.status(200).json(companies);
    } catch (error) {
        console.error('Error listing companies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The company ID
 *     responses:
 *       200:
 *         description: The company data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyInput'
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/companies/:id', (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.id, 10);
        const company = companyService.getCompanyById(companyId);
        if (!company) {
            res.status(404).json({ error: 'Company not found' });
            return;
        }
        res.status(200).json(company);
    } catch (error) {
        console.error('Error getting company by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/companies/{id}/projects:
 *   post:
 *     summary: Add a project to an existing company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: The updated company
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyInput'
 *       500:
 *         description: Internal Server Error
 */
router.post('/companies/:id/projects', (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.id, 10);
        const projectData: ProjectInput = req.body;
        const updatedCompany = companyService.addProjectToCompany(companyId, projectData);
        res.status(200).json(updatedCompany);
    } catch (error) {
        console.error('Error adding project to company:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
