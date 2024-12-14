import { User as UserPrisma } from '@prisma/client';

export class User {
    readonly id?: number;
    readonly username: string;
    readonly password: string;
    readonly email: string;

    constructor(user: {
        id?: number;
        username: string;
        password: string;
        email: string;
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
    
    }

    validate(user: { id?: number; username: string; password: string; email: string; }) {
        if (user.id !== undefined && user.id < 0) {

            throw new Error('Id cannot be negative.');

        }

        if (!user.username?.trim()) {
            throw new Error('Username is required.');
        }

        if (!user.email?.trim()) {
            throw new Error('Email is required.');
        }

        const regexMail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!regexMail.test(user.email)) {
          throw new Error('Email does not have a correct format.');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required.');
        }

        
    }

    // Static from method to convert Prisma object to domain model
    static from(data: UserPrisma): User {
        return new User({
            id: data.id,
            username: data.username,
            password: data.password,
            email: data.email,
            
        });
    }
}
