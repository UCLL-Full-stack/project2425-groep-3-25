import express, { Request, Response, NextFunction } from "express";
import * as employeeService from "../service/Employee.service";
import jwt from "jsonwebtoken";

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET!;

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Endpoints for managing employees
 */

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: List of all employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /employees/deleteAll:
 *   delete:
 *     summary: Delete all employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: All employees deleted successfully
 */
router.delete(
  "/deleteAll",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await employeeService.deleteAllEmployees();
      res.status(200).json({ message: "All employees deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
);

router.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: number; role: string };
    console.log("Decoded token:", decoded); 

    if (decoded.role !== "Company") {
      return res.status(403).json({ error: "Forbidden: Only companies can access this resource." });
    }

    req.body.companyId = decoded.id; 
    console.log("Company ID set in req.body:", req.body.companyId); 
    next();
  } catch (err) {
    console.error("JWT decoding error:", err); 
    return res.status(401).json({ error: "Invalid token." });
  }
});


const validateCompanyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret) as { id: number; role: string };

    if (!decoded || decoded.role !== "Company" || !decoded.id) {
      return res.status(403).json({ error: "Forbidden: Only companies can access this resource." });
    }

    req.body.companyId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token." });
  }
};

/**
 * @swagger
 * /employees/addEmployee:
 *   post:
 *     summary: Add an employee to a company
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               telefoonnummer:
 *                 type: string
 *             required:
 *               - email
 *               - telefoonnummer
 *     responses:
 *       201:
 *         description: Employee added successfully
 *       400:
 *         description: Email and phone number are required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/addEmployee", validateCompanyToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.body;
    const { email, telefoonnummer } = req.body;

    if (!email || !telefoonnummer) {
      return res.status(400).json({ error: "Email and phone number are required." });
    }

    const employee = await employeeService.addEmployeeToCompany(companyId, email, telefoonnummer);
    res.status(201).json({ message: "Employee added successfully.", employee });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees for a company
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all employees for the company
 *       400:
 *         description: Company ID is required
 *       500:
 *         description: Failed to fetch employees
 */
router.get("/employees", async (req, res) => {
  console.log("Request body:", req.body); 
  const { companyId } = req.body; 

  if (!companyId) {
    console.error("Company ID is missing in request body."); 
    return res.status(400).json({ error: "Company ID is required." });
  }

  try {
    const employees = await employeeService.getEmployeesForCompany(companyId); 
    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Failed to fetch employees." });
  }
});
/**
 * @swagger
 * /employees/{employeeId}:
 *   delete:
 *     summary: Delete an employee by ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the employee to delete
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       400:
 *         description: Employee ID is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete(
  "/:employeeId",
  validateCompanyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employeeId } = req.params;

      if (!employeeId) {
        return res.status(400).json({ error: "Employee ID is required." });
      }

      const deletedEmployee = await employeeService.deleteEmployee(parseInt(employeeId, 10));
      res.status(200).json({ message: "Employee deleted successfully.", deletedEmployee });
    } catch (error) {
      next(error);
    }
  }
);


export default router;
