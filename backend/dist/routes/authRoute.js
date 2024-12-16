"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
const saltValue = 8;
const userController_1 = require("../controllers/userController");
const postController_1 = require("../controllers/postController");
const authController_1 = require("../controllers/authController");
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uname, email, password } = req.body;
        if (!uname || !email || !password) {
            console.log('All fields cannot be empty.');
            return;
        }
        const getUser = yield (0, userController_1.getUserByUname)(uname);
        console.log(`getUserByUname in /register: `, getUser);
        if (getUser !== null) {
            // console.log('Username already existed. Please use another username.')
            return res.status(400).json({ errorEmail: 'Username already exists. Please use another uname.' });
        }
        const getUser2 = yield (0, userController_1.getUserByEmail)(email);
        console.log(`getUserByEmail in /register: `, getUser);
        if (getUser2 !== null) {
            console.log('Email already exists.');
            return res.status(400).json({ errorEmail: 'Email already existed. Please use another email.' });
        }
        let avatar = '';
        const newUser = yield (0, userController_1.addUser)(uname, email, password, avatar);
        if (newUser) {
            return res.status(200).json({ successMsg: 'registered successfully.' });
        }
        else {
            throw new Error('Failed to register.');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error in /register:', error.message);
            return res.status(500).json({ errorRegister: `Error in /register: ${error.message}` });
        }
    }
}));
router.post("/login", (req, res, next) => {
    passport_1.default.authenticate("local", { failureRedirect: "/auth/login", failureMessage: true }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ errorLogin: `errorLogin ${err.message}` });
        }
        if (!user) {
            const errorE = (info === null || info === void 0 ? void 0 : info.message) || "backend /login: NO SUCH USER";
            return res.status(401).json({ errorLogin: `${errorE}` });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ errorLogin: `req.logIn: ${err.message}` });
            }
            const successMsg = `Success. Redirecting ...`;
            if ((0, checkAuth_1.isAdmin)(req)) {
                return res.status(200).json({ user: user, isAdmin: true, successMsg });
            }
            else {
                console.log('@login User logged in:', user);
                console.log('@login Session after login session:', req.session.passport.user);
                // console.log('@login Session after login session.user:', req.session.user);
                return res.status(200).json({ user: user, isAdmin: false, successMsg });
            }
        });
    })(req, res, next);
});
router.get("/github", passport_1.default.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport_1.default.authenticate("github", { session: true }), (req, res) => {
    console.log("route backend/ github user:", JSON.stringify(req.user, null, 2));
    req.session.save((err) => {
        var _a;
        if (err) {
            console.error('Session save error:', err);
            return res.status(500).send({ error: 'Failed to save session.' });
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin') {
            res.redirect("http://localhost:3000/auth/admin");
        }
        else {
            res.redirect("http://localhost:3000/public/posts");
        }
    });
});
router.post('/forgot', checkAuth_1.forwardAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { info, newpassword, confirmnewpassword } = req.body;
        if (!info || !newpassword || !confirmnewpassword) {
            console.log('All fields cannot be empty.');
            return;
        }
        if (newpassword !== confirmnewpassword) {
            console.log('Passwords do not match.');
            return;
        }
        const user = yield (0, userController_1.getUserByUnameOrEmail)(info, info);
        if (!user || !user.password) {
            return res.status(400).json({ errorEmail: 'NO SUCH USER/EMAIL' });
        }
        const updatedPwdUser = yield (0, userController_1.resetPassword)(info, newpassword);
        if (updatedPwdUser) {
            return res.status(200).json({ successReset: 'Password reset successfully.' });
        }
    }
    catch (error) {
        console.error('Backend Error in forgot:', error);
    }
}));
router.post('/logout', (req, res) => {
    const user = req.user;
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ errorMsg: 'Failed to log out.' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ successMsg: 'Successfully logged out.' });
    });
});
router.get("/admin", (req, res) => {
    const adminUser = req.user;
    if (!req.isAuthenticated()) {
        console.log(`user not authenticated @admin`);
    }
    res.status(200).json({ adminUser, successMsg: 'Admin user is authenticated.' });
});
router.get("/admin/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield (0, postController_1.getPosts)();
    const positive = yield (0, authController_1.positivePosts)();
    const negative = yield (0, authController_1.negativePosts)();
    const neutral = yield (0, authController_1.neutralPosts)();
    if (!req.isAuthenticated()) {
        console.log(`admin not authenticated @admin/posts`);
    }
    return res.status(200).json({
        posts: positive.decoratedPosts,
        pos: { posts: positive.posts, percentagePositive: positive.percentagePositive, percentagePCS: positive.percentagePCS },
        neg: { posts: negative.posts, percentageNegative: negative.percentageNegative, percentageNCS: negative.percentageNCS },
        neu: { posts: neutral.posts, percentageNeutral: neutral.percentageNeutral, percentageNeutralCS: neutral.percentageNeutralCS }
    });
}));
router.post("/admin/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
router.get('/admin/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, userController_1.getUsers)();
    const usersWithoutAdmin = users === null || users === void 0 ? void 0 : users.filter((user) => user.role !== 'admin');
    return res.status(200).json({ users: usersWithoutAdmin });
}));
exports.default = router;
