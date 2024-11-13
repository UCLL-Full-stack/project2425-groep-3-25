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

// Create a new company
router.post('/companies', async (req: Request, res: Response) => {
    try {
        const companyData: CompanyInput = req.body;
        const newCompany = await companyService.createCompany(companyData);
        res.status(201).json(newCompany);
    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// List all companies
router.get('/companies', async (req: Request, res: Response) => {
    try {
        const companies = await companyService.listCompanies();
        res.status(200).json(companies);
    } catch (error) {
        console.error('Error listing companies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a company by ID
router.get('/companies/:id', async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.id, 10);
        const company = await companyService.getCompanyById(companyId);
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

// Add a project to an existing company
router.post('/companies/:id/projects', async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.id, 10);
        const projectData: ProjectInput = req.body;
        const updatedCompany = await companyService.addProjectToCompany(companyId, projectData);
        res.status(200).json(updatedCompany);
    } catch (error) {
        console.error('Error adding project to company:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
