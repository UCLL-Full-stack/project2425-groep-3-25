import { User } from "../domain/model/User"
import * as userDb from "../repository/User.db"
import { UserInput } from "../types"
import * as bcrypt from 'bcrypt'



const getAllUsers = async () => {
    const users = await userDb.getAllUsers();
    return users;
  };

const getUserById = async ({id}: {id: number}) => {
    const user = await userDb.getUserById({id});
    return user;
  }

const getUserByUsername = async ({ username } :{ username : string }): Promise<User> => {
    const user = await userDb.getUserByUsername({ username });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

const createUser = async ({username, password, email}: UserInput): Promise<User> => {
    if (!username) {
        throw new Error('Username is required');
    }
    const existing = await userDb.getUserByUsername({ username });
    if (existing) {
        throw new Error('Username already exists');
    }

    if (!password) {
        throw new Error('Password is required');
    }
    if (!email) {
        throw new Error('Email is required');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({username, password: hashedPassword, email});
    

    return await userDb.createUser(user);
}

const updateUser = async (id: number, updatedData: Partial<Pick<User, 'username' | 'password' | 'email'>>) => {
    const updatedUser = await userDb.updateUser(id, updatedData);
    return updatedUser;
}

const deleteUser = async (id: number) => {
    await userDb.deleteUser({id});
}

const authenticate = async ({username, password}: UserInput) => {
    if (!username) {
        return false;
    }
    const user = await userDb.getUserByUsername({username});
    if (!user) {
      return false;
    }
    if (user.password !== password) {
      return false;
    }
    return true;
}

export default {
    getAllUsers,
    getUserById,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser,
    authenticate
}



