import { Employee } from '../../domain/model/Employee';

describe('Employee', () => {
    it('should create an employee with valid data', () => {
        const employee = new Employee({
            id: 1,
            naam: 'John Doe',
            email: 'john.doe@example.com',
            telefoonnummer: '1234567890',
        });

        expect(employee.id).toBe(1);
        expect(employee.naam).toBe('John Doe');
        expect(employee.email).toBe('john.doe@example.com');
        expect(employee.telefoonnummer).toBe('1234567890');
    });

    it('should throw an error if any field is empty', () => {
        expect(() => {
            new Employee({
                id: 1,
                naam: '',
                email: 'john.doe@example.com',
                telefoonnummer: '1234567890',
            });
        }).toThrow('All fields are required.');

        expect(() => {
            new Employee({
                id: 1,
                naam: 'John Doe',
                email: '',
                telefoonnummer: '1234567890',
            });
        }).toThrow('All fields are required.');

        expect(() => {
            new Employee({
                id: 1,
                naam: 'John Doe',
                email: 'john.doe@example.com',
                telefoonnummer: '',
            });
        }).toThrow('All fields are required.');
    });

    it('should throw an error if email format is invalid', () => {
        expect(() => {
            new Employee({
                id: 1,
                naam: 'John Doe',
                email: 'invalid-email',
                telefoonnummer: '1234567890',
            });
        }).toThrow('Invalid email format.');
    });
});
