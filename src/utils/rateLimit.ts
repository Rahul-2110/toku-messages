import rateLimit from 'express-rate-limit';
import { Request } from 'express';


export const ipRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per `windowMs`
    keyGenerator: (req) => {
      return req.ip; // Use the request's IP address as the key
    },
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests from this IP. Please try again later.',
      });
    },
  });


export const userRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each user to 100 requests per `windowMs`
    keyGenerator: (req: Request) => {
        const user = req.user; // Assuming `req.user` is populated after authentication
        return user ? user.username : 'anonymous';
    },
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many requests from this user. Please try again later.',
        });
    },
});