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
require("dotenv/config");
require('dotenv').config();
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
const userController_1 = require("../../controllers/userController");
const uuid_1 = require("uuid");
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    throw new Error("Missing GitHub client ID or secret");
}
const githubStrategy = new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/github/callback",
    passReqToCallback: true,
    scope: ['user:email']
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const email = profile.emails && ((_a = profile.emails[0]) === null || _a === void 0 ? void 0 : _a.value) ? profile.emails[0].value : null;
    if (!email) {
        console.log("GitHub email not available.");
        return done(new Error("GitHub email not available"), false);
    }
    const avatar = profile.photos && ((_b = profile.photos[0]) === null || _b === void 0 ? void 0 : _b.value) ? profile.photos[0].value : '';
    let githubUser = {
        id: (0, uuid_1.v5)(profile.id, uuid_1.v5.URL),
        uname: profile.username,
        email: email,
        password: '',
        role: 'user',
        avatar: avatar
    };
    try {
        const getUser = yield (0, userController_1.getUserByUnameOrEmail)(githubUser.uname, email);
        if (!getUser) {
            console.log(`User not found. started to add the github user to database.`);
            yield (0, userController_1.addUser)(githubUser.uname, githubUser.email, githubUser.password, avatar);
            const supabaseUser = yield (0, userController_1.getUserByUname)(githubUser.uname);
            console.log(`supabaseUser @githubStrategy: `, supabaseUser);
            return done(null, supabaseUser);
        }
        else {
            return done(null, getUser);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error in GitHubStrategy:', error.message);
        }
        return done(error);
    }
}));
passport_1.default.serializeUser(function (user, done) {
    console.log('github Serializing user:', user);
    console.log('github Serializing user with ID:', user.id);
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield (0, userController_1.getUserById)(id);
        console.log(`github user @deserializeUser: `, user);
        if (user) {
            console.log(`github user inside deserializeUser: `, user);
            done(null, user);
        }
        else {
            done({ message: "User not found" }, null);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("GitHubStrategy Error:", error.message);
        }
        return done(error);
    }
}));
const passportGitHubStrategy = {
    name: 'github',
    strategy: githubStrategy
};
exports.default = passportGitHubStrategy;
