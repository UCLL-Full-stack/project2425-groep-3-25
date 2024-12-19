import express, { Request, Response, NextFunction } from "express";
import * as employeeService from "../service/Employee.service";
import jwt from "jsonwebtoken";

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET!;

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: List of all employees
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
    console.log("Decoded token:", decoded); // Debugging

    if (decoded.role !== "Company") {
      return res.status(403).json({ error: "Forbidden: Only companies can access this resource." });
    }

    req.body.companyId = decoded.id; // Set companyId for later use
    console.log("Company ID set in req.body:", req.body.companyId); // Debugging
    next();
  } catch (err) {
    console.error("JWT decoding error:", err); // Debugging
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

    req.body.companyId = decoded.id; // Attach companyId to the request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token." });
  }
};

// Add an employee to a company
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

// Get all employees for a company
router.get("/employees", async (req, res) => {
  console.log("Request body:", req.body); // Debugging
  const { companyId } = req.body; // Extracted from middleware

  if (!companyId) {
    console.error("Company ID is missing in request body."); // Debugging
    return res.status(400).json({ error: "Company ID is required." });
  }

  try {
    const employees = await employeeService.getEmployeesForCompany(companyId); // Fetch employees
    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err); // Debugging
    res.status(500).json({ error: "Failed to fetch employees." });
  }
});

export default router;
