import express, { Request, Response } from "express";
import { assignEmployeeToProjectService, getEmployeesByProject } from "../service/Employee_project.service";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: EmployeeProject
 *   description: Management of employee assignments to projects
 */

/**
 * @swagger
 * /projects/{projectId}/employees:
 *   post:
 *     summary: Assign an employee to a project
 *     tags: [EmployeeProject]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: The ID of the employee to assign
 *                 example: 5
 *               role:
 *                 type: string
 *                 description: The role of the employee in the project
 *                 example: Developer
 *     responses:
 *       201:
 *         description: Employee successfully assigned to the project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projectId:
 *                   type: integer
 *                 employeeId:
 *                   type: integer
 *                 role:
 *                   type: string
 *       400:
 *         description: Missing required fields or invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/projects/:projectId/employees", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { employeeId, role } = req.body;

    if (!employeeId || !role) {
      return res.status(400).json({ error: "Employee ID and role are required." });
    }

    const result = await assignEmployeeToProjectService({
      employeeId: parseInt(employeeId, 10),
      projectId: parseInt(projectId, 10),
      role,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error assigning employee to project:", error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
});

/**
 * @swagger
 * /projects/{projectId}/employees:
 *   get:
 *     summary: Get employees assigned to a project
 *     tags: [EmployeeProject]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the project
 *     responses:
 *       200:
 *         description: List of employees assigned to the project and its category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     naam:
 *                       type: string
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       naam:
 *                         type: string
 *                       role:
 *                         type: string
 *       400:
 *         description: Missing or invalid project ID
 *       500:
 *         description: Internal server error
 */
router.get("/:projectId/employees", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required." });
    }

    const { category, employees } = await getEmployeesByProject(parseInt(projectId, 10));

    res.status(200).json({
      category, 
      employees, 
    });
  } catch (error) {
    console.error("Error fetching employees and project details:", error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
});

export default router;
