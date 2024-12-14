import { User } from '../../domain/model/User';
import { Role } from '../../types';

describe('User', () => {
    it('should create a user with valid data', () => {
        const user = new User({
            id: 1,
            username: 'john_doe',
            password: 'password123',
            email: 'john@ucll.be',
           
        });

        expect(user.id).toBe(1);
        expect(user.username).toBe('john_doe');
        expect(user.password).toBe('password123');
        expect(user.email).toBe('john@ucll.be');
        
    });

    it('should throw an error if id is negative', () => {
        expect(() => {
            new User({
                id: -1,
                username: 'john_doe',
                password: 'password123',
                email: 'john@ucll.be',
                
            });
        }).toThrow('Id cannot be negative.');
    });

    it('should throw an error if username is empty', () => {
        expect(() => {
            new User({
                id: 1,
                username: '',
                password: 'password123',
                email: 'john@ucll.be',
                
            });
        }).toThrow('Username is required.');
    });

    it('should throw an error if email is empty', () => {
        expect(() => {
            new User({
                id: 1,
                username: 'john_doe',
                password: 'password123',
                email: '',
                
            });
        }).toThrow('Email is required.');
    });

    it('should throw an error if email format is invalid', () => {
        expect(() => {
            new User({
                id: 1,
                username: 'john_doe',
                password: 'password123',
                email: 'john@',
                
            });
        }).toThrow(
            'Email does not have a correct format.'
        );
    });

    it('should throw an error if password is empty', () => {
        expect(() => {
            new User({
                id: 1,
                username: 'john_doe',
                password: '',
                email: 'john@ucll.be',
                
            });
        }).toThrow('Password is required.');
    });


});
