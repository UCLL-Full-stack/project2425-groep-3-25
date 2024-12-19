import { assignEmployeeToProjectService, getEmployeesByProject } from '../../service/Employee_project.service';
import * as employeeProjectDb from '../../repository/Employee_Project.db';

jest.mock('../../repository/Employee_Project.db');

describe('Employee Project Service Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('assignEmployeeToProjectService', () => {
        it('should successfully assign an employee to a project', async () => {
            const mockAssignment = {
                employeeId: 1,
                projectId: 2,
                role: 'Developer',
            };
            (employeeProjectDb.addEmployeeToProject as jest.Mock).mockResolvedValue(mockAssignment);

            const result = await assignEmployeeToProjectService(mockAssignment);

            expect(employeeProjectDb.addEmployeeToProject).toHaveBeenCalledWith(mockAssignment);
            expect(result).toEqual(mockAssignment);
        });

        it('should throw an error if repository function fails', async () => {
            (employeeProjectDb.addEmployeeToProject as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(
                assignEmployeeToProjectService({ employeeId: 1, projectId: 2, role: 'Developer' })
            ).rejects.toThrow('Database error');
        });
    });

    describe('getEmployeesByProject', () => {
        it('should return employees and category for a project', async () => {
            const mockResponse = {
                employees: [
                    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
                    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
                ],
                category: { id: 1, naam: 'Development' },
            };
            (employeeProjectDb.getEmployeesByProjectId as jest.Mock).mockResolvedValue(mockResponse);

            const result = await getEmployeesByProject(1);

            expect(employeeProjectDb.getEmployeesByProjectId).toHaveBeenCalledWith(1);
            expect(result).toEqual({
                employees: mockResponse.employees,
                category: { id: 1, naam: 'Development' },
            });
        });

        it('should handle missing category', async () => {
            const mockResponse = {
                employees: [{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }],
                category: null,
            };
            (employeeProjectDb.getEmployeesByProjectId as jest.Mock).mockResolvedValue(mockResponse);

            const result = await getEmployeesByProject(1);

            expect(employeeProjectDb.getEmployeesByProjectId).toHaveBeenCalledWith(1);
            expect(result).toEqual({
                employees: mockResponse.employees,
                category: null,
            });
        });

        it('should throw an error if repository function fails', async () => {
            (employeeProjectDb.getEmployeesByProjectId as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(getEmployeesByProject(1)).rejects.toThrow('Database error');
        });
    });
});
