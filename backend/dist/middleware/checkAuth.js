"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.forwardAuthenticated = exports.ensureAuthenticated = void 0;
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized: Please log in to access this resource.' });
};
exports.ensureAuthenticated = ensureAuthenticated;
const forwardAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.status(403).json({ message: 'Forbidden: You are already logged in.' });
};
exports.forwardAuthenticated = forwardAuthenticated;
const isAdmin = (req) => {
    if (req.user) {
        const thisUser = req.user;
        return thisUser.role === 'admin';
    }
    return false;
};
exports.isAdmin = isAdmin;
