"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passportMiddleware_1 = __importDefault(require("./middleware/passportMiddleware"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const port = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.set('trust proxy', 1);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
    },
}));
(0, passportMiddleware_1.default)(app);
app.use((req, res, next) => {
    var _a;
    if (req.session && req.session.passport && req.session.passport.user) {
        console.log('Session exists @app:', req.session.passport.user);
    }
    else {
        console.log('No session found');
    }
    console.log('passport.user @app:', ((_a = req.session.passport) === null || _a === void 0 ? void 0 : _a.user));
    next();
});
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const indexRoute_1 = __importDefault(require("./routes/indexRoute"));
const postRoute_1 = __importDefault(require("./routes/postRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
app.use("/", indexRoute_1.default);
app.use("/auth", authRoute_1.default);
app.use("/public", postRoute_1.default);
app.use("/user/profile", userRoute_1.default);
app.listen(port, () => {
    console.log(`🚀 Social Media Server has started at ${process.env.REACT_APP_BACKEND_BASEURL}`);
});
