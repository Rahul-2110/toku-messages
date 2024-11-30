import express, { Request, Response } from 'express';
import User from './../db/models/user';
import { generateToken } from '../utils/jwtUtils';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
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

export default router; 