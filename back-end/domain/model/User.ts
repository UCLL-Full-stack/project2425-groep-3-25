import { Role } from '../../types';

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

    static from({
        id,
        username,
        password,
        email,
        role,
    }: {
        id: number;
        username: string;
        password: string;
        email: string;
        role: Role;
    }) {
        return new User({
            id,
            username,
            password,
            email,
            role: role as Role,
        });
    }
}
