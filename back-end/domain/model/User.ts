import { User as UserPrisma } from '@prisma/client';
import { Role } from '../../types';

export class User {
    readonly id?: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly password: string;
    readonly email: string;
    readonly role: Role;

    constructor(user: {
        id?: number;
        firstName: string;
        lastName: string;
        password: string;
        email: string;
        role: Role;
    }) {
        this.validate(user);

        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.password = user.password;
        this.email = user.email;
        this.role = user.role;
    
    }
    

    validate(user: { id?: number; firstName: string; lastName: string;  password: string; email: string; role: Role; }) {
        if (user.id !== undefined && user.id < 0) {
            throw new Error('Id cannot be negative.');
        }


        if (!user.email || !user.email.trim()) {
            console.error('Invalid or missing email:', user.email);
            throw new Error('Email is required.');
          }
          
        const regexMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexMail.test(user.email.trim())) {
        console.error('Invalid email format:', user.email);
        throw new Error('Invalid email format. Please provide a valid email address.');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required.');
        }
        if (!user.role?.trim()) {
            throw new Error('Role is required.');
        }

        
    }

    // Static from method to convert Prisma object to domain model
    static from(data: UserPrisma): User {
        try  {return new User({
            id: data.id,
            firstName : data.firstName,
            lastName : data.lastName,
            password: data.password,
            email: data.email,
            role: data.role as Role,
        });}
        catch (error) {
            console.error('Error creating User object:', (error as Error).message, data);
            throw error; }
    }
}
