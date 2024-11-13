import { PrismaClient } from '@prisma/client';
import { Employee } from '../domain/model/Employee';

const prisma = new PrismaClient();

export class EmployeeRepository {
    async create(employeeData: {
        naam: string;
        email: string;
        telefoonnummer: string;
        bedrijf_id: number;
    }): Promise<Employee> {
        const newEmployeeData = await prisma.employee.create({
            data: {
                naam: employeeData.naam,
                email: employeeData.email,
                telefoonnummer: employeeData.telefoonnummer,
                bedrijf_id: employeeData.bedrijf_id,
            },
        });
        return Employee.from(newEmployeeData);
    }

    async findById(id: number): Promise<Employee | undefined> {
        const employeeData = await prisma.employee.findUnique({
            where: { id },
        });
        return employeeData ? Employee.from(employeeData) : undefined;
    }

    async findAll(): Promise<Employee[]> {
        const employeesData = await prisma.employee.findMany();
        return employeesData.map(Employee.from);
    }
}
