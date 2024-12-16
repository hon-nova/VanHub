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
const postController_1 = require("../controllers/postController");
const router = express_1.default.Router();
router.get('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!req.isAuthenticated()) {
        return res.status(401).send({ error: 'User not authenticated' });
    }
    const posts = yield (0, postController_1.getPosts)();
    res.status(200).json({ posts, user });
}));
router.post("/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, link, description, subgroup } = req.body;
        const user = req.user;
        if (!user)
            throw new Error('Please login to add posts.');
        if (!title || !link || !description || !subgroup)
            throw new Error('Please fill in all required fields');
        const creator = user === null || user === void 0 ? void 0 : user.id;
        const post = yield (0, postController_1.addPost)({ title, link, description, creator, subgroup });
        res.status(200).json({ post, successMsg: 'Post added.' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ errorMsg: error.message });
        }
    }
}));
router.post("/posts/edit/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { title, link, description, subgroup } = req.body;
        if (!title || !link || !description || !subgroup)
            throw new Error('@post Please fill in all required fields');
        const updatedPost = yield (0, postController_1.editPost)(id, { title, link, description, subgroup });
        if (!updatedPost)
            throw new Error('@editPost: error updating post');
        res.status(200).json({ post: updatedPost, successMsg: 'Post updated.' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ errorMsg: error.message });
        }
    }
}));
router.delete("/posts/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const isDeleted = yield (0, postController_1.deletePost)(id);
        if (!isDeleted)
            throw new Error('@deletePost: error deleting post');
        res.status(200).json({ successMsg: 'Post deleted.' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ errorMsg: error.message });
        }
    }
}));
router.post('/posts/comment-create/:postid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description } = req.body;
        const post_id = Number(req.params.postid);
        const user = req.user;
        const creator = user === null || user === void 0 ? void 0 : user.id;
        if (!description) {
            throw new Error('@post Please add your comment content.');
        }
        const newComment = yield (0, postController_1.addComment)({ post_id, description, creator });
        res.status(200).json({ comment: newComment, successMsg: 'Comment added.' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ errorMsg: error.message });
        }
    }
}));
router.get('/posts/show/:postid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post_id = Number(req.params.postid);
        const comments = yield (0, postController_1.getCommentsByPostId)(post_id);
        const netVotesDb = yield (0, postController_1.getNetVotesByPostId)(post_id);
        res.status(200).json({ comments, netVotesDb });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ errorMsg: error.message });
        }
    }
}));
router.delete('/posts/comment-delete/:commentid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = Number(req.params.commentid);
        const isDeleted = yield (0, postController_1.deleteComment)(commentId);
        if (isDeleted) {
            res.status(200).json({ successMsg: 'Comment deleted.' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ errorMsg: error.message });
        }
    }
}));
router.post("/posts/vote/:postid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post_id = Number(req.params.postid);
        const user = req.user;
        if (!user) {
            throw new Error('@post Please login to vote.');
        }
        const user_id = user.id;
        const value = Number(req.body.setvoteto);
        if (!value)
            throw new Error('@post Please add your vote.');
        const updatedNetVotes = yield (0, postController_1.addNewOrUpdateVote)({ post_id, user_id, value });
        const netVotesDb = yield (0, postController_1.getNetVotesByPostId)(post_id);
        if (updatedNetVotes) {
            res.status(200).json({ setvoteto: updatedNetVotes.value, netVotesDb });
        }
        else {
            throw new Error('@addVote: error adding vote');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`error @/posts/vote: `, error.message);
            res.status(500).json({ errorVoteMsg: error.message });
        }
    }
}));
exports.default = router;
