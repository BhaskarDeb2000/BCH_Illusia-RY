import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = {
            id: user.id,
            email: user.email || '',
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}; 