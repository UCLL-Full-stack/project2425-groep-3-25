
import { Employee } from "../domain/model/Employee";
import * as employeeDb from "../repository/Employee.db";

// Service to delete all employees
export const deleteAllEmployees = async () => {
  return await employeeDb.deleteAllEmployees();
};

// Service to get all employees
export const getAllEmployees = async () => {
  return await employeeDb.getAllEmployees();
};

export const addEmployeeToCompany = async (
  bedrijfId: number,
  email: string,
  telefoonnummer: string
): Promise<Employee> => {
  return await employeeDb.addEmployeeToCompany(
    bedrijfId,
    email,
    telefoonnummer
  );
};

export const getEmployeesForCompany = async (
  companyId: number
): Promise<Employee[]> => {
  return await employeeDb.getEmployeesByCompanyId(companyId);
};