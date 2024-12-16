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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const userController_1 = require("../../controllers/userController");
const bcrypt_1 = __importDefault(require("bcrypt"));
const localStrategy = new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userController_1.getUserByEmail)(email);
        console.log(`user @localStrategy: `, user);
        if (!user) {
            return done(null, false, { message: `Couldn't find user with email: ${email}` });
        }
        const isPwdValid = bcrypt_1.default.compareSync(password, user.password);
        if (!isPwdValid) {
            return done(null, false, { message: "Password is incorrect!!" });
        }
        return done(null, user);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("LocalStrategy Error:", error.message);
        }
        return done(error);
    }
}));
passport_1.default.serializeUser(function (user, done) {
    // console.log('Serializing user:', user);
    // console.log('Serializing user with ID:', user.id); 
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(`DESERIALIZEUSER GOT TRIGGERED at last`)
        let user = yield (0, userController_1.getUserById)(id);
        // console.log(`user @deserializeUser: `, user)
        if (user) {
            // console.log(`user inside user deserializeUser: `, user)         
            done(null, user);
        }
        else {
            done({ message: "User not found" }, null);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("LocalStrategy Error:", error.message);
        }
        return done(error);
    }
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    // passport.serializeUser(function (user:Express.User,done: (err: any, id?: string) => void){
    //    console.log('async Serializing user:', user);
    //    done(null,user.id)
    // })
    // passport.deserializeUser(async function(id:string,done: (err: any, user?: Express.User | false | null) => void){
    //    console.log('async Deserializing user with ID:', id);
    //    let user = await getUserById(id)
    //    console.log(`async user @deserializeUser: `, user)
    //    if (user){
    //       console.log(`async user inside user: `, user)
    //       done(null,user)
    //    } else {
    //       done({message: "User not found"},null)
    //    }
    // });
}))();
const passportLocalStrategy = {
    name: "local",
    strategy: localStrategy
};
exports.default = passportLocalStrategy;
