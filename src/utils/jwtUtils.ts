import jwt from 'jsonwebtoken';
import { IUser } from '../db/models/user';

const secretKey: string = 'your_secret_key';

export const generateToken = (user: IUser): string => {
    return jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, secretKey);
}; 