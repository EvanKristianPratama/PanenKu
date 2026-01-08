import { User } from '../types';

export let users: User[] = [
    {
        id: 1,
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin',
        role: 'admin'
    },
    {
        id: 2,
        name: 'User Demo',
        email: 'user@example.com',
        password: 'user',
        role: 'user'
    }
];
