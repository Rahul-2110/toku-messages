import express, { Request, Response } from 'express';
import User from './../db/models/user';
import { generateToken } from '../utils/jwtUtils';
import validateRequest from '../utils/validator/request';
import { loginSchema, registerSchema } from '../utils/validator/auth';

const router = express.Router();

router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }
        if (await user.comparePassword(password)) {
            const token = generateToken(user);
            res.json({ message: 'Authentication successful', token });
        } else {
            res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/register', validateRequest(registerSchema), async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({ username, password });
        await newUser.save();        
        res.json({ message: 'User registered successfully', username });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router; 