import { Employee as EmployeePrisma } from "@prisma/client";

export class Employee {
  readonly id?: number;
  readonly naam: string;
  readonly email: string;
  readonly telefoonnummer: string;
  readonly bedrijf_id: number;

  constructor(employee: {
    id?: number;
    naam: string;
    email: string;
    telefoonnummer: string;
    bedrijf_id: number;
  }) {
    this.id = employee.id;
    this.naam = employee.naam;
    this.email = employee.email;
    this.telefoonnummer = employee.telefoonnummer;
    this.bedrijf_id = employee.bedrijf_id;

    this.validate();
  }

  private validate() {
    if (!this.naam?.trim()) {
      throw new Error("Employee name is required.");
    }
    if (!this.email?.trim()) {
      throw new Error("Employee email is required.");
    }
    if (!this.telefoonnummer?.trim()) {
      throw new Error("Employee phone number is required.");
    }
  }

  static from(data: EmployeePrisma): Employee {
    return new Employee({
      id: data.id,
      naam: data.naam,
      email: data.email,
      telefoonnummer: data.telefoonnummer,
      bedrijf_id: data.bedrijf_id,
    });
  }
}
