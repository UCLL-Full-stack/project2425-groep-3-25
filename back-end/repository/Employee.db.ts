import { PrismaClient } from '@prisma/client';
import { Employee } from '../domain/model/Employee';

const prisma = new PrismaClient();

const createEmployee = async ({
  naam,
  email,
  telefoonnummer,
  bedrijf_id,
}: {
  naam: string;
  email: string;
  telefoonnummer: string;
  bedrijf_id: number;
}): Promise<Employee> => {
  try {
    const newEmployee = await prisma.employee.create({
      data: {
        naam,
        email,
        telefoonnummer,
        bedrijf_id,
      },
    });
    return Employee.from(newEmployee);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while creating the employee');
  }
};

const getEmployeeById = async ({
  id,
}: {
  id: number;
}): Promise<Employee | null> => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
    });
    return employee ? Employee.from(employee) : null;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while finding the employee by ID');
  }
};

const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const employees = await prisma.employee.findMany();
    return employees.map(Employee.from);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while retrieving all employees');
  }
};

export { createEmployee, getEmployeeById, getAllEmployees };
