import { Employee as EmployeePrisma } from '@prisma/client';

export class Employee {
    readonly id: number;
    readonly naam: string;
    readonly email: string;
    readonly telefoonnummer: string;

    constructor(employee: { id: number; naam: string; email: string; telefoonnummer: string }) {
        this.validate(employee);

        this.id = employee.id;
        this.naam = employee.naam;
        this.email = employee.email;
        this.telefoonnummer = employee.telefoonnummer;
    }

    private validate(employee: {
        id: number;
        naam: string;
        email: string;
        telefoonnummer: string;
    }) {
        if (!employee.naam?.trim() || !employee.email?.trim() || !employee.telefoonnummer?.trim()) {
            throw new Error('All fields are required.');
        }
        if (!this.validateEmail(employee.email)) {
            throw new Error('Invalid email format.');
        }
    }

    private validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Static from method to convert Prisma object to domain model
    static from(data: EmployeePrisma): Employee {
        return new Employee({
            id: data.id,
            naam: data.naam,
            email: data.email,
            telefoonnummer: data.telefoonnummer,
        });
    }
}
