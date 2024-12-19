import { User } from "../domain/model/User"
import * as userDb from "../repository/User.db"
import * as companyDb from "../repository/Company.db"

import { Role, UserInput } from "../types"
import * as bcrypt from 'bcrypt'
import { generateJwtToken } from "../types/jwt";



const getAllUsers = async () => {
    const users = await userDb.getAllUsers();
    return users;
  };

const getUserById = async ({id}: {id: number}) => {
    const user = await userDb.getUserById({id});
    return user;
  }



const createUser = async (userData: UserInput): Promise<User> => {
  const { firstName, lastName, email, password, role, companyName, locatie, validationInfo } = userData;

  if (!firstName || !lastName || !email || !password || !role) {
    throw new Error('All required fields must be filled');
  }

  const existingUser = await userDb.getUserByEmail({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await userDb.createUser({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    validate(user){}
  });
  console.log('Created User:', newUser); 


  if (role === 'Company') {
    if (!companyName || !locatie) {
      throw new Error('Company name and location are required for Company accounts.');
    }

   
    await companyDb.createCompany({
      naam: companyName,
      locatie,
      validationInfo: validationInfo || '',
      user_id: newUser.id,
    });
  }

  return newUser;
};
  
  

const updateUser = async (id: number, updatedData: Partial<Pick<User, 'firstName' | 'lastName' | 'password' | 'email'>>) => {
    if (updatedData.email) {
        const existingUser = await userDb.getUserByEmail({ email: updatedData.email });
        if (existingUser && existingUser.id !== id) {
            throw new Error('Email already exists');
        }
    }
    const updatedUser = await userDb.updateUser(id, updatedData);
    return updatedUser;
}

const deleteUser = async (id: number) => {
    await userDb.deleteUser({id});
}

const authenticate = async ({ email, password }: UserInput) => {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
  
    
    const user = await userDb.getUserByEmail({ email });
    if (!user) {
      throw new Error('Invalid username or password.');
    }
  
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password.');
    }
  
    
    if (!user.id) {
      throw new Error('User ID is undefined.');
    }
    const token = generateJwtToken({ id: user.id, email: user.email, role: user.role });
  
    return {
      message: 'Authentication successful',
      token,
      email: user.email,
      role: user.role,
    };
    
}

const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await userDb.getUserByEmail({ email });
  if (!user) {
    throw new Error('User not found.');
  }
  return user;
};


const deleteAllUsers = async (): Promise<void> => {
  return await userDb.deleteAllUsers();
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    authenticate,
    deleteAllUsers,
    getUserByEmail,
}





