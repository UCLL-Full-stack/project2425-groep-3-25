import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addEmployeeToProject = async ({
  employeeId,
  projectId,
  role,
}: {
  employeeId: number;
  projectId: number;
  role: string;
}) => {
  // Validate if employee exists
  const employeeExists = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employeeExists) {
    throw new Error(`Employee with ID ${employeeId} does not exist.`);
  }

  // Validate if project exists
  const projectExists = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!projectExists) {
    throw new Error(`Project with ID ${projectId} does not exist.`);
  }

  // Create the employee_project record
  return await prisma.employee_Project.create({
    data: {
      employee_id: employeeId,
      project_id: projectId,
      rol: role,
    },
  });
};

export const getEmployeesByProjectId = async (projectId: number) => {
  try {
    const projectWithEmployees = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        category: true, // Include the category details
        employeeProjects: {
          include: {
            employee: true, // Include employee details
          },
        },
      },
    });

    if (!projectWithEmployees) {
      throw new Error(`Project with ID ${projectId} does not exist.`);
    }

    // Structure the response to include category and employees
    const category = projectWithEmployees.category;
    const employees = projectWithEmployees.employeeProjects.map((ep) => ep.employee);

    return {
      category,
      employees,
    };
  } catch (error) {
    console.error("Error fetching employees and project details:", error);
    throw new Error("Failed to fetch employees and project details.");
  }
};