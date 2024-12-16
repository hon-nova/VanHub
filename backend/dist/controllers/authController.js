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
exports.getSentiment = void 0;
exports.analyzeSentiment = analyzeSentiment;
exports.positivePosts = positivePosts;
exports.negativePosts = negativePosts;
exports.neutralPosts = neutralPosts;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({ apiKey: process.env.OPEN_ACCESS_KEY });
const postController_1 = require("../controllers/postController");
const getSentiment = (description) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const completion = yield openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant for sentiment analysis.',
                },
                {
                    role: 'user',
                    content: `Please analyze the sentiment of the following text and classify it as positive, negative, or neutral. Provide only the sentiment as a single word response, followed by a confidence score as a percentage:\n\n${description}`,
                },
            ],
        });
        const sentiment = (_b = (_a = completion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        return sentiment;
    }
    catch (error) {
        console.error('Error analyzing sentiment:', error);
        return 'error';
    }
});
exports.getSentiment = getSentiment;
function analyzeSentiment() {
    return __awaiter(this, void 0, void 0, function* () {
        const sentimentArr = [];
        const posts = yield (0, postController_1.getPosts)();
        yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
            const sentiment = yield getSentiment(post.description);
            const sen = sentiment === null || sentiment === void 0 ? void 0 : sentiment.split(",")[0];
            const cs = (sentiment === null || sentiment === void 0 ? void 0 : sentiment.split(",")[1]) ? parseFloat(sentiment === null || sentiment === void 0 ? void 0 : sentiment.split(",")[1]) : 0;
            sentimentArr.push({ post_id: post.id, sentiment: sen, confidence_score: cs });
        })));
        return sentimentArr;
    });
}
function positivePosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const sentimentArr = yield analyzeSentiment();
        const posts = yield (0, postController_1.getPosts)();
        const decoratedPosts = posts.map((post) => {
            const sentimentData = sentimentArr.find((obj) => obj.post_id === post.id);
            return (Object.assign(Object.assign({}, post), { sentiment: sentimentData.sentiment, confidence_score: sentimentData.confidence_score }));
        });
        const positiveSentiments = sentimentArr.filter((obj) => obj.sentiment === 'positive');
        const percentagePositive = (positiveSentiments.length / sentimentArr.length) * 100;
        const percentagePCS = positiveSentiments.reduce((acc, obj) => acc + obj.confidence_score, 0) / positiveSentiments.length;
        const positivePosts = yield Promise.all(positiveSentiments
            .map((obj) => __awaiter(this, void 0, void 0, function* () { return yield (0, postController_1.getPostById)(obj.post_id); })));
        return { decoratedPosts, posts: positivePosts, percentagePositive, percentagePCS };
    });
}
function negativePosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const sentimentArr = yield analyzeSentiment();
        const negativeSentiments = sentimentArr.filter((obj) => obj.sentiment === 'negative');
        const negativePosts = (yield Promise.all(negativeSentiments
            .map((obj) => __awaiter(this, void 0, void 0, function* () { return yield (0, postController_1.getPostById)(obj.post_id); }))));
        const percentageNegative = (negativePosts.length / sentimentArr.length) * 100;
        const percentageNCS = negativeSentiments.reduce((acc, obj) => acc + obj.confidence_score, 0) / negativeSentiments.length;
        return { posts: negativePosts, percentageNegative, percentageNCS };
    });
}
function neutralPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const sentimentArr = yield analyzeSentiment();
        const neutralSentiments = sentimentArr.filter((obj) => obj.sentiment === 'neutral');
        const neutralPosts = (yield Promise.all(neutralSentiments
            .map((obj) => __awaiter(this, void 0, void 0, function* () { return yield (0, postController_1.getPostById)(obj.post_id); }))));
        const percentageNeutral = (neutralPosts.length / sentimentArr.length) * 100;
        const percentageNeutralCS = 50;
        return { posts: neutralPosts, percentageNeutral, percentageNeutralCS };
    });
}
