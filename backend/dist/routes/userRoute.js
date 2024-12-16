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
const userController_1 = require("../controllers/userController");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const user_id = user.id;
    const updatedUser = yield (0, userController_1.readAvatarsFromDisk)(user_id);
    if (!updatedUser) {
        throw new Error("BACKEND: User'\s avatar cannot get updated");
    }
    return res.json({ user: updatedUser });
}));
router.post('/settings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description } = req.body;
        const user = req.user;
        const user_id = user.id;
        if (!description) {
            return res.status(400).json({ message: 'Description is required' });
        }
        yield (0, userController_1.handleAvatarGeneration)(description, user_id);
        const updatedUser = yield (0, userController_1.uploadAvatarToSupabase)(user_id);
        return res.json({ user, successMsg: 'Successfully generated avatar' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res.status(500).json({ message: error.message });
        }
    }
}));
exports.default = router;
