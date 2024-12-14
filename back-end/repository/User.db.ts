import { PrismaClient } from '@prisma/client';
import { User } from '../domain/model/User';
import { Role, UserInput } from '../types';

const prisma = new PrismaClient();

const createUser = async ({username, password, email,}: User): Promise<User> => {
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        email, 
      },
    });
    return User.from(newUser);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while creating the user');
  }
};

const getUserById = async ({
  id,
}: {
  id: number;
}): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user ? User.from(user) : null;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while finding the user by ID');
  }
};

const getUserByUsername = async ({username }: {username: string}): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user ? User.from(user) : null;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while finding the user by username');
  }
};

const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await prisma.user.findMany();
    return users.map(User.from);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while retrieving all users');
  }
};

const updateUser = async (id: number, updatedData: Partial<User>): Promise<User | null> => {
  try {
    const userExists = await prisma.user.findUnique({
      where: { id, },
    });
    if (!userExists) return null;

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: updatedData,
    });
    return User.from(updatedUser);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while updating the user');
  }
};

const deleteUser = async ({
  id,
}: {
  id: number;
}): Promise<void> => {
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while deleting the user');
  }
};

export {
  createUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
  updateUser,
  deleteUser,
};

