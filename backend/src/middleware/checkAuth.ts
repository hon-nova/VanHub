import { Request, Response, NextFunction } from 'express';

// Middleware to ensure the user is authenticated
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // If not authenticated, respond with a 401 status for the frontend to handle
    res.status(401).json({ message: 'Unauthorized: Please log in to access this resource.' });
};

// Middleware to forward unauthenticated users
export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    // If already authenticated, let the frontend decide where to redirect
    res.status(403).json({ message: 'Forbidden: You are already logged in.' });
};

// Middleware to check if the user is an admin
export const isAdmin = (req: Request) => {
	if (req.user) {
		 const thisUser = req.user as Express.User;
		 return thisUser.role === 'admin';
	}
	return false;
};
