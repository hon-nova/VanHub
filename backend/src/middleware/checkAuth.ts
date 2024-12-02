import { Request, Response, NextFunction } from 'express';

// Middleware to ensure the user is authenticated
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    
    res.status(401).json({ message: 'Unauthorized: Please log in to access this resource.' });
};


export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        return next();
    }
   
    res.status(403).json({ message: 'Forbidden: You are already logged in.' });
};


export const isAdmin = (req: Request) => {
	if (req.user) {
		 const thisUser = req.user as Express.User;
		 return thisUser.role === 'admin';
	}
	return false;
};
