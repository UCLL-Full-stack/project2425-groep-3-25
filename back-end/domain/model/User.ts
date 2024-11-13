import { User as UserPrisma, Role } from '@prisma/client';

export class User {
    readonly id: number;
    readonly username: string;
    readonly password: string;
    readonly email: string;
    readonly role: Role;

    constructor(user: {
        id: number;
        username: string;
        password: string;
        email: string;
        role: Role;
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.role = user.role;
    }

    validate(user: { id: number; username: string; password: string; email: string; role: Role }) {
        if (user.id <= 0) {
            throw new Error('Id cannot be negative.');
        }

        if (!user.username?.trim()) {
            throw new Error('Username is required.');
        }

        if (!user.email?.trim()) {
            throw new Error('Email is required.');
        }

        const regexMail = new RegExp('^[A-Za-z._%+-]+@ucll\\.be');
        if (!regexMail.test(user.email)) {
            throw new Error(
                'Email does not have a correct format. Example format: John@ucll.be or JohnDoe@ucll.be (Numbers are not authorized)'
            );
        }

        if (!user.password?.trim()) {
            throw new Error('Password is required.');
        }

        if (user.role !== 'Admin' && user.role !== 'User') {
            throw new Error('Role does not have the correct format.');
        }
    }

    // Static from method to convert Prisma object to domain model
    static from(data: UserPrisma): User {
        return new User({
            id: data.id,
            username: data.username,
            password: data.password,
            email: data.email,
            role: data.role,
        });
    }
}
