import { PrismaClient } from '@prisma/client';
import { User } from '../domain/model/User';
import { Role, UserInput } from '../types';

const prisma = new PrismaClient();

const createUser = async ({firstName, lastName, password, email, role}: User): Promise<User> => {
  try {
    const newUser = await prisma.user.create({
      data: {
        firstName, 
        lastName,
        password,
        email, 
        role,
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

// const getUserByUsername = async ({username }: {username: string}): Promise<User | null> => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         username,
//       },
//     });
//     return user ? User.from(user) : null;
//   } catch (error) {
//     console.error(error);
//     throw new Error('An error occurred while finding the user by username');
//   }
// };
const getUserByEmail = async ({email }: {email: string}): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user ? User.from(user) : null;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while finding the user by email');
  }
};

const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        company: true, 
        employee: true, 
      }});
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

const deleteAllUsers = async (): Promise<void> => {
  try {
    await prisma.user.deleteMany(); // Deletes all users in the database
    console.log('All users have been deleted successfully.');
  } catch (error) {
    console.error('Error deleting all users:', (error as any).message);
    throw new Error('An error occurred while deleting all users');
  }
};

export {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
  deleteAllUsers,
};

