// write a migration script to create 5 initial users

import { Schema } from 'mongoose';
import User from '../models/user';

const initialSetup = async () => {
    console.log('Running initial setup migration...');

    let users = [
        {
            username: 'user1',
            password: 'passworduser1',
        },
        {
            username: 'user2',
            password: 'passworduser2',
        },
        {
            username: 'user3',
            password: 'passworduser3',
        },
        {
            username: 'user4',
            password: 'passworduser4',
        },
        {
            username: 'user5',
            password: 'passworduser5',
        },
    ]

    let userPromises = []

    for (let i = 0; i < users.length; i++) {
        const userDoc = await User.findOne({ username: users[i].username });
        if(!userDoc) {
            const user = new User(users[i]);
            userPromises.push(user.save());
        }
        
    }


    console.log('Initial setup migration complete.');
};

export default initialSetup;