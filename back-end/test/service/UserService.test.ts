import userService from '../../service/User.service'; 
import * as userDb from '../../repository/User.db';
import * as companyDb from '../../repository/Company.db';
import * as bcrypt from 'bcrypt';
import { generateJwtToken } from '../../types/jwt';
import { UserInput } from '../../types';

jest.mock('../../repository/User.db');
jest.mock('../../repository/Company.db');
jest.mock('bcrypt');
jest.mock('../../types/jwt');

describe('User Service Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [{ id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }];
            (userDb.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

            const result = await userService.getAllUsers();

            expect(userDb.getAllUsers).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockUsers);
        });
    });

    describe('getUserById', () => {
        it('should return the user for a valid ID', async () => {
            const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
            (userDb.getUserById as jest.Mock).mockResolvedValue(mockUser);

            const result = await userService.getUserById({ id: 1 });

            expect(userDb.getUserById).toHaveBeenCalledWith({ id: 1 });
            expect(result).toEqual(mockUser);
        });

        it('should return null if the user is not found', async () => {
            (userDb.getUserById as jest.Mock).mockResolvedValue(null);

            const result = await userService.getUserById({ id: 999 });

            expect(userDb.getUserById).toHaveBeenCalledWith({ id: 999 });
            expect(result).toBeNull();
        });
    });

    describe('createUser', () => {
        it('should create a user and associate with a company if role is Company', async () => {
            const userInput: UserInput = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'Company',
                companyName: 'Acme Corp',
                locatie: 'New York',
                validationInfo: 'Contact info',
            };

            const mockUser = { id: 1, ...userInput };
            (userDb.getUserByEmail as jest.Mock).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (userDb.createUser as jest.Mock).mockResolvedValue(mockUser);
            (companyDb.createCompany as jest.Mock).mockResolvedValue({ id: 1, naam: 'Acme Corp' });

            const result = await userService.createUser(userInput);

            expect(userDb.getUserByEmail).toHaveBeenCalledWith({ email: 'john@example.com' });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
            expect(userDb.createUser).toHaveBeenCalledWith({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'hashedPassword',
                role: 'Company',
                validate: expect.any(Function),
            });
            expect(companyDb.createCompany).toHaveBeenCalledWith({
                naam: 'Acme Corp',
                locatie: 'New York',
                validationInfo: 'Contact info',
                user_id: 1,
            });
            expect(result).toEqual(mockUser);
        });

        it('should throw an error if the email already exists', async () => {
            const userInput: UserInput = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'User',
            };

            (userDb.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });

            await expect(userService.createUser(userInput)).rejects.toThrow('Email already exists');
        });
    });

    describe('authenticate', () => {
        it('should authenticate a user and return a JWT token', async () => {
            const mockUser = { id: 1, email: 'john@example.com', password: 'hashedPassword', role: 'User' };
            (userDb.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (generateJwtToken as jest.Mock).mockReturnValue('jwtToken');

            const result = await userService.authenticate({ email: 'john@example.com', password: 'password123' });

            expect(userDb.getUserByEmail).toHaveBeenCalledWith({ email: 'john@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(generateJwtToken).toHaveBeenCalledWith({ id: 1, email: 'john@example.com', role: 'User' });
            expect(result).toEqual({
                message: 'Authentication successful',
                token: 'jwtToken',
                email: 'john@example.com',
                role: 'User',
            });
        });

        it('should throw an error if the email is not found', async () => {
            (userDb.getUserByEmail as jest.Mock).mockResolvedValue(null);

            await expect(userService.authenticate({ email: 'invalid@example.com', password: 'password123' })).rejects.toThrow(
                'Invalid username or password.'
            );
        });

        it('should throw an error if the password is incorrect', async () => {
            const mockUser = { id: 1, email: 'john@example.com', password: 'hashedPassword', role: 'User' };
            (userDb.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(userService.authenticate({ email: 'john@example.com', password: 'wrongPassword' })).rejects.toThrow(
                'Invalid username or password.'
            );
        });
    });

    describe('deleteUser', () => {
        it('should delete a user by ID', async () => {
            (userDb.deleteUser as jest.Mock).mockResolvedValue(1);

            await userService.deleteUser(1);

            expect(userDb.deleteUser).toHaveBeenCalledWith({ id: 1 });
        });
    });
});
