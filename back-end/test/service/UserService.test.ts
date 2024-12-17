import userService from '../../service/User.service';
import * as userDb from '../../repository/User.db';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/model/User';
import { generateJwtToken } from '../../types/jwt';
import { UserInput } from '../../types';

jest.mock('../../repository/User.db');
jest.mock('bcrypt');
jest.mock('../../types/jwt');

describe('User Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [
                new User({ id: 1, username: 'user1', password: 'hashedPass1', email: 'user1@test.com', role: 'User' }),
                new User({ id: 2, username: 'user2', password: 'hashedPass2', email: 'user2@test.com', role: 'Admin' }),
            ];
            (userDb.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

            const users = await userService.getAllUsers();
            expect(users).toEqual(mockUsers);
            expect(userDb.getAllUsers).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUserById', () => {
        it('should return a user by ID', async () => {
            const mockUser = new User({ id: 1, username: 'user1', password: 'hashedPass1', email: 'user1@test.com', role: 'User' });
            (userDb.getUserById as jest.Mock).mockResolvedValue(mockUser);

            const user = await userService.getUserById({ id: 1 });
            expect(user).toEqual(mockUser);
            expect(userDb.getUserById).toHaveBeenCalledWith({ id: 1 });
        });

        it('should return null if user is not found', async () => {
            (userDb.getUserById as jest.Mock).mockResolvedValue(null);

            const user = await userService.getUserById({ id: 999 });
            expect(user).toBeNull();
        });
    });

    describe('getUserByUsername', () => {
        it('should return a user by username', async () => {
            const mockUser = new User({ id: 1, username: 'user1', password: 'hashedPass1', email: 'user1@test.com', role: 'User' });
            (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);

            const user = await userService.getUserByUsername({ username: 'user1' });
            expect(user).toEqual(mockUser);
        });

        it('should throw an error if user is not found', async () => {
            (userDb.getUserByUsername as jest.Mock).mockResolvedValue(null);

            await expect(userService.getUserByUsername({ username: 'nonexistent' })).rejects.toThrow('User not found');
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const mockUserInput: UserInput = {
                username: 'newUser',
                password: 'password123',
                email: 'newuser@test.com',
                role: 'User',
            };
            const hashedPassword = 'hashedPassword123';
            const mockCreatedUser = new User(
               { username: 'newUser',
                password: 'password123',
                email: 'newuser@test.com',
                role: 'User',
                }
            );

            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            (userDb.createUser as jest.Mock).mockResolvedValue(mockCreatedUser);
            (userDb.getUserByUsername as jest.Mock).mockResolvedValue(null);

            const createdUser = await userService.createUser(mockUserInput);
            expect(createdUser).toEqual(mockCreatedUser);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
        });

        it('should throw an error if username already exists', async () => {
            
            const mockExistingUser = new User({username: 'existingUser',
                password: 'password123',
                email: 'existinguser@test.com',
                role: 'User', });

            (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockExistingUser);

            await expect(userService.createUser(mockExistingUser)).rejects.toThrow('Username already exists');
        });
    });

    describe('updateUser', () => {
        it('should update an existing user', async () => {
            const mockUpdatedData = { username: 'updatedUser' };
            const mockUpdatedUser = new User({
                id: 1,
                username: 'updatedUser',
                password: 'hashedPass1',
                email: 'user1@test.com',
                role: 'User',
            });

            (userDb.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);
            (userDb.getUserByUsername as jest.Mock).mockResolvedValue(null);

            const updatedUser = await userService.updateUser(1, mockUpdatedData);
            expect(updatedUser).toEqual(mockUpdatedUser);
        });

        it('should throw an error if the new username already exists', async () => {
            const mockExistingUser = new User({ id: 2, username: 'existingUser', password: 'hashedPass2', email: 'user2@test.com', role: 'User' });

            (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockExistingUser);

            await expect(userService.updateUser(1, { username: 'existingUser' })).rejects.toThrow('Username already exists');
        });
    });

    describe('deleteUser', () => {
        it('should delete a user by ID', async () => {
            (userDb.deleteUser as jest.Mock).mockResolvedValue(undefined);

            await userService.deleteUser(1);
            expect(userDb.deleteUser).toHaveBeenCalledWith({ id: 1 });
        });
    });

    describe('authenticate', () => {
        it('should authenticate a user and return a token', async () => {
            const mockUserInput: UserInput = { username: 'user1', password: 'password123' };
            const mockUser = new User({
                id: 1,
                username: 'user1',
                password: 'hashedPassword',
                email: 'user1@test.com',
                role: 'User',
            });
            const mockToken = 'mockJwtToken';

            (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (generateJwtToken as jest.Mock).mockReturnValue(mockToken);

            const result = await userService.authenticate(mockUserInput);
            expect(result).toEqual({ token: mockToken, username: 'user1' });
        });

        it('should throw an error if username is not found', async () => {
            (userDb.getUserByUsername as jest.Mock).mockResolvedValue(null);

            await expect(userService.authenticate({ username: 'nonexistent', password: 'password123' })).rejects.toThrow('User not found');
        });

        it('should throw an error if password is incorrect', async () => {
            const mockUser = new User({
                id: 1,
                username: 'user1',
                password: 'hashedPassword',
                email: 'user1@test.com',
                role: 'User',
            });

            (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(userService.authenticate({ username: 'user1', password: 'wrongPassword' })).rejects.toThrow('Incorrect password');
        });
    });
});