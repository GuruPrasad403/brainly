import { Request, Response, NextFunction } from 'express';
import { ApiStatus, HttpStatus } from '../types/status.types';
import jwt from 'jsonwebtoken';
import { JWT_AUTH } from '../config/env';

const authMiddleware = (req: Request, res: Response, next: NextFunction) :void=> {
    try {
        const headerToken = req.headers.authorization;

        if (!headerToken || !headerToken.startsWith("Bearer ")) {
             res.status(HttpStatus.BadRequest).json({
                success: ApiStatus.Warning,
                msg: "No Token Found",
            });
            return;
        }
        
        const token: string = headerToken.split(" ")[1];

        try {
            const decoded = jwt.verify(token, JWT_AUTH) as { id: string };
            (req as any).userId = decoded.id;
            next();
        } catch (jwtError) {
            const message = jwtError instanceof jwt.TokenExpiredError
                ? "Token expired"
                : "Invalid token";

            res.status(HttpStatus.Unauthorized).json({
                success: ApiStatus.Error,
                msg: message
            });
            return 
        }
    } catch (error) {
        console.error("Error in Middleware", error);
        next(error);
    }
};

export default authMiddleware;
