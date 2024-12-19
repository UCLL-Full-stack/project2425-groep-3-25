import { PrismaClient } from '@prisma/client';
import { Employee } from '../domain/model/Employee';

const prisma = new PrismaClient();
// Add an employee to a company


export const getEmployeeByUserId = async (userId: number) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { user_id: userId },
      include: {
        user: true, // Include the associated user details
        company: true, // Optionally include the company details
      },
    });

    return employee;
  } catch (error) {
    console.error(`Error fetching employee by user ID: ${userId}`, error);
    throw new Error("Failed to retrieve employee.");
  }
}



export const addEmployeeToCompany = async (
  bedrijfId: number,
  email: string,
  telefoonnummer: string
): Promise<Employee> => {
  // Validate that the user exists and does not already have an employee record
  const user = await prisma.user.findUnique({
    where: { email },
    include: { employee: true },
  });

  if (!user) {
    throw new Error("User with this email does not exist.");
  }
  if (user.employee) {
    throw new Error("User is already assigned as an employee.");
  }

  // Create the employee and associate it with the company
  const employee = await prisma.employee.create({
    data: {
      naam: `${user.firstName} ${user.lastName}`,
      email: user.email,
      telefoonnummer,
      bedrijf_id: bedrijfId,
      user_id: user.id,
    },
  });

  return Employee.from(employee);
};

export const getEmployeesByCompanyId = async (
  companyId: number
): Promise<Employee[]> => {
  const employees = await prisma.employee.findMany({
    where: { bedrijf_id: companyId },
  });

  return employees.map(Employee.from);
};



export const deleteAllEmployees = async () => {
  return await prisma.employee.deleteMany();
};

// Function to get all employees
export const getAllEmployees = async () => {
  return await prisma.employee.findMany({
    include: {
      user: true, // Include user details if needed
      company: true, // Include company details if needed
    },
  });
};

export const deleteEmployeeById = async (employeeId: number) => {
  try {
    const deletedEmployee = await prisma.employee.delete({
      where: { id: employeeId },
    });
    return deletedEmployee;
  } catch (error) {
    console.error(`Error deleting employee with ID ${employeeId}:`, error);
    throw new Error("Failed to delete employee.");
  }
};

