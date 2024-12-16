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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
exports.addPost = addPost;
exports.getPostById = getPostById;
exports.editPost = editPost;
exports.deletePost = deletePost;
exports.getCommentsByPostId = getCommentsByPostId;
exports.addComment = addComment;
exports.deleteComment = deleteComment;
exports.getNetVotesByPostId = getNetVotesByPostId;
exports.addNewOrUpdateVote = addNewOrUpdateVote;
const supabaseClient_1 = require("../db/supabaseClient");
const userController_1 = require("./userController");
function formatTimestamp(timestamp) {
    if (timestamp == null) {
        console.error('Invalid timestamp:', timestamp);
        return null;
    }
    const data = new Date(timestamp);
    const dataFormatted = data.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    return data.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}
function getPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabaseClient_1.supabase.from('posts').select();
            if (error)
                throw new Error('@getPosts: error getPosts: ');
            const posts = yield Promise.all(data.map((p) => __awaiter(this, void 0, void 0, function* () {
                let newPost = Object.assign(Object.assign({}, p), { creator: (yield (0, userController_1.getUserById)(p.creator)) || null, timestamp: formatTimestamp(p.timestamp) || null });
                return newPost;
            })));
            const sortedPosts = posts.sort((a, b) => (Number(b.id) - Number(a.id)));
            return sortedPosts;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`error @getPosts: `, error.message);
            }
            return [];
        }
    });
}
function addPost(post) {
    return __awaiter(this, void 0, void 0, function* () {
        let newPost = Object.assign(Object.assign({}, post), { timestamp: Date.now() });
        try {
            const { data, error } = yield supabaseClient_1.supabase.from('posts').insert(newPost).select().single();
            if (error)
                throw new Error('@addPost: error addPost ');
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch @addPost: `, error.message);
            }
            return null;
        }
    });
}
function getPostById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabaseClient_1.supabase.from('posts').select().eq('id', id).single();
            if (error)
                throw new Error('@getPostById: error getPostById: ');
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch: `, error.message);
            }
            return null;
        }
    });
}
function editPost(id, changes) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const post = yield getPostById(id);
            const updates = {};
            if (post) {
                if (changes.title) {
                    updates.title = changes.title;
                }
                if (changes.link) {
                    updates.link = changes.link;
                }
                if (changes.description) {
                    updates.description = changes.description;
                }
                if (changes.subgroup) {
                    updates.subgroup = changes.subgroup;
                }
                const { data, error } = yield supabaseClient_1.supabase.from('posts').update(updates).eq('id', id).select('*').single();
                if (error)
                    throw new Error(`@editPost: function error: ${error.message}`);
                return data;
            }
            else {
                return null;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch: `, error.message);
            }
            return null;
        }
    });
}
function deletePost(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const post = yield getPostById(id);
            if (!post)
                throw new Error('@deletePost: post not found');
            const { data, error } = yield supabaseClient_1.supabase.from('posts').delete().eq('id', id);
            if (error)
                throw new Error('@deletePost: error deletePost: ');
            return true;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch: `, error.message);
            }
            return false;
        }
    });
}
function addComment(comment) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newComment = Object.assign(Object.assign({}, comment), { timestamp: Date.now() });
            const { data, error } = yield supabaseClient_1.supabase.from('comments').insert(newComment).select().single();
            if (error)
                throw new Error('@addComment: error addComment ');
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch: `, error.message);
            }
            return null;
        }
    });
}
function getCommentById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { data, error } = yield supabaseClient_1.supabase.from('comments').select().eq('id', id).single();
            if (error)
                throw new Error('@getCommentById: error getCommentById: ');
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch: `, error.message);
            }
            return null;
        }
    });
}
function getCommentsByPostId(post_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabaseClient_1.supabase
                .from('comments')
                .select()
                .eq('post_id', post_id);
            if (error)
                throw new Error('@getComments: error getComments: ');
            const comments = data;
            const decoratedComments = yield Promise.all(comments.map((c) => __awaiter(this, void 0, void 0, function* () {
                return Object.assign(Object.assign({}, c), { creator: (yield (0, userController_1.getUserById)(c.creator)) || null, timestamp: formatTimestamp(c.timestamp) || null });
            })));
            const sortedComments = decoratedComments.sort((a, b) => Number(b.id) - Number(a.id));
            return sortedComments;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch: `, error.message);
            }
            return [];
        }
    });
}
function deleteComment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const comment = yield getCommentById(id);
            if (!comment)
                throw new Error('@deleteComment: comment not found');
            const { data, error } = yield supabaseClient_1.supabase.from('comments').delete().eq('id', id);
            if (error)
                throw new Error('@deleteComment: error deleteComment: ');
            return true;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch: `, error.message);
            }
            return false;
        }
    });
}
function getVoteByPostIdAndUserId(postId, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabaseClient_1.supabase.from('votes').select().eq('post_id', postId).eq('user_id', user_id).single();
            if (error)
                throw new Error(`@getVoteByPostIdAnUserId: error getVoteByPostIdAnUserId: ${error.message}`);
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch: `, error.message);
            }
            return null;
        }
    });
}
function addNewOrUpdateVote(vote) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingVote = yield getVoteByPostIdAndUserId(vote.post_id, vote.user_id);
            let votes = yield getVotes();
            let updates = {};
            updates = {
                value: vote.value
            };
            if (existingVote) {
                if (existingVote.value === vote.value) {
                    const { data, error } = yield supabaseClient_1.supabase.from('votes')
                        .update({ value: 0 })
                        .eq('post_id', vote.post_id)
                        .eq('user_id', vote.user_id)
                        .select('*')
                        .single();
                    if (error)
                        throw new Error(`Error updating vote to neutral: ${error.message}`);
                    return Object.assign(Object.assign({}, data), { value: 0 });
                }
                const { data, error } = yield supabaseClient_1.supabase.from('votes')
                    .update({ value: vote.value })
                    .eq('post_id', vote.post_id)
                    .eq('user_id', vote.user_id)
                    .select('*')
                    .single();
                if (error)
                    throw new Error(`Error updating vote: ${error.message}`);
                return data;
            }
            else {
                const newvote = {
                    post_id: vote.post_id,
                    user_id: vote.user_id,
                    value: vote.value
                };
                const { data, error } = yield supabaseClient_1.supabase.from('votes').insert(newvote).select().single();
                if (error)
                    throw new Error(`@addNewOrUpdateVote error: ${error.message}`);
                return data;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch: `, error.message);
            }
            return null;
        }
    });
}
function getVotes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabaseClient_1.supabase.from('votes').select();
            if (error)
                throw new Error('@getVotes: error getVotes: ');
            const votes = data;
            return votes;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch: `, error.message);
            }
            return null;
        }
    });
}
function getVotesByPostId(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabaseClient_1.supabase.from('votes').select().eq('post_id', postId);
            if (error)
                throw new Error('@getVotesByPostId: error getVotesByPostId: ');
            const votes = data;
            return votes;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch: `, error.message);
            }
            return null;
        }
    });
}
function getNetVotesByPostId(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const votes = yield getVotesByPostId(postId);
            const netVotes = votes.reduce((acc, { value }) => acc + value, 0);
            return netVotes;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`catch: `, error.message);
            }
            return 0;
        }
    });
}
