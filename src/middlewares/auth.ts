import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import User from '../db/models/user';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);
    try {

        const user = verifyToken(token);
        if (!user) return res.sendStatus(403);

        const userDoc = await User.findOne({ _id: user.id });
        if (!userDoc) return res.sendStatus(403);

        req.user = userDoc;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token is expired" });
        } else {
            return res.sendStatus(500); // Internal Server Error for other potential errors
        }
    }

};