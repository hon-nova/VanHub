"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const PassportConfig_1 = __importDefault(require("./PassportConfig"));
const localStrategy_1 = __importDefault(require("./passportStrategies/localStrategy"));
const githubStrategy_1 = __importDefault(require("./passportStrategies/githubStrategy"));
const strategies = [localStrategy_1.default, githubStrategy_1.default];
const passportConfig = new PassportConfig_1.default(strategies);
passportConfig.addStrategies(strategies);
const passportMiddleware = (app) => {
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
};
exports.default = passportMiddleware;
