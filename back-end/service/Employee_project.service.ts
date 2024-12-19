import { addEmployeeToProject, getEmployeesByProjectId } from "../repository/Employee_Project.db";

export const assignEmployeeToProjectService = async ({
  employeeId,
  projectId,
  role,
}: {
  employeeId: number;
  projectId: number;
  role: string;
}) => {
  return await addEmployeeToProject({ employeeId, projectId, role });
};

export const getEmployeesByProject = async (projectId: number) => {
  const { employees, category } = await getEmployeesByProjectId(projectId);

  return {
    category: category ? { id: category.id, naam: category.naam } : null,
    employees, 
  };
};

