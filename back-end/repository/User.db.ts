import { PrismaClient } from '@prisma/client';
import { User } from '../domain/model/User';
import { Role } from '../types'; // Assuming you have a `Role` type defined in your project

const prisma = new PrismaClient();

export class UserRepository {
    // Create a new user in the database
    async create(userData: {
        username: string;
        password: string;
        email: string;
        role: Role;
    }): Promise<User> {
        const newUserData = await prisma.user.create({
            data: {
                username: userData.username,
                password: userData.password,
                email: userData.email,
                role: userData.role,
            },
        });
        return User.from(newUserData); // Convert Prisma object to domain model
    }

    // Find a user by its ID
    async findById(id: number): Promise<User | undefined> {
        const userData = await prisma.user.findUnique({
            where: { id },
        });
        return userData ? User.from(userData) : undefined;
    }

    // Retrieve all users from the database
    async findAll(): Promise<User[]> {
        const usersData = await prisma.user.findMany();
        return usersData.map(User.from); // Map each Prisma object to a User instance
    }

    // Update a user in the database
    async update(
        id: number,
        updatedData: { username?: string; password?: string; email?: string; role?: Role }
    ): Promise<User | undefined> {
        const userExists = await prisma.user.findUnique({ where: { id } });
        if (!userExists) return undefined;

        const updatedUserData = await prisma.user.update({
            where: { id },
            data: updatedData,
        });
        return User.from(updatedUserData);
    }

    // Delete a user from the database
    async delete(id: number): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }
}
