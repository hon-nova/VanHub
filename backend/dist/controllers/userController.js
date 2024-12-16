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
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.getUserByUname = getUserByUname;
exports.resetPassword = resetPassword;
exports.getUserByEmailAndPassword = getUserByEmailAndPassword;
exports.getUserByEmail = getUserByEmail;
exports.isUserValid = isUserValid;
exports.addUser = addUser;
exports.getUserByUnameOrEmail = getUserByUnameOrEmail;
exports.updateUser = updateUser;
exports.fetchImageAsBlob = fetchImageAsBlob;
exports.uploadFile = uploadFile;
exports.handleAvatarGeneration = handleAvatarGeneration;
exports.saveAvatarToDisk = saveAvatarToDisk;
exports.readAvatarsFromDisk = readAvatarsFromDisk;
exports.uploadAvatarToSupabase = uploadAvatarToSupabase;
const supabaseClient_1 = require("../db/supabaseClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("node:fs/promises"));
const saltValue = 8;
function addUser(uname, email, password, avatar) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashedPassword = bcrypt_1.default.hashSync(password, saltValue);
            const { data, error } = yield supabaseClient_1.supabase
                .from('users')
                .insert([{ uname, email, password: hashedPassword, avatar }])
                .select("*")
                .single();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('addUser - Error:', error);
            return null;
        }
    });
}
function saveAvatarToDisk(imageUrl, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const imageDir = path_1.default.join(__dirname, '../../../backend/src/avatars');
            const imagePath = path_1.default.join(imageDir, `${userId}-${Date.now()}.png`);
            if (!fs_1.default.existsSync(imageDir)) {
                fs_1.default.mkdirSync(imageDir, { recursive: true });
            }
            const response = yield axios_1.default.get(imageUrl, { responseType: "arraybuffer" });
            fs_1.default.writeFileSync(imagePath, response.data);
            return imagePath;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('saveAvatarToDisk - Error:', error.message);
            }
            return '';
        }
    });
}
function fetchImageAsBlob(imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(imageUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch image from ${imageUrl}`);
            }
            return yield response.blob();
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('CATCH fetchImageAsBlob - Error:', error.message);
                return undefined;
            }
        }
    });
}
function uploadFile(blob, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filePath = `https://supabase.com/dashboard/project/pvvdexpxtesuyjnodslj/storage/buckets/avatars/${userId}-${Date.now()}.png`;
            const { data, error } = yield supabaseClient_1.supabase.storage
                .from('avatars')
                .upload(filePath, blob, { upsert: true, contentType: 'image/png' });
            if (error)
                throw new Error(`Upload failed ${error.message}`);
            const { data: publicUrlData } = supabaseClient_1.supabase.storage.from('avatars').getPublicUrl(filePath);
            return publicUrlData === null || publicUrlData === void 0 ? void 0 : publicUrlData.publicUrl;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('CATCH uploadFile - Error:', error.message);
                return '';
            }
        }
    });
}
function saveUserAvatar(userId, avatarUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabaseClient_1.supabase
                .from('users')
                .update({ avatar: avatarUrl })
                .eq('id', userId);
            if (error) {
                console.error('Error updating user avatar:', error.message);
                throw new Error('Failed to update user avatar.');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('saveUserAvatar - Error:', error.message);
            }
        }
    });
}
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({ apiKey: process.env.OPEN_ACCESS_KEY });
function handleAvatarGeneration(description, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const image = yield openai.images.generate({
                model: "dall-e-2",
                prompt: description,
                size: "256x256",
                style: "natural"
            });
            const avatarUrl = image.data[0].url;
            if (!avatarUrl) {
                throw new Error('Failed to generate avatar.');
            }
            const imagePath = yield saveAvatarToDisk(avatarUrl, userId);
            if (imagePath) {
                console.log(`SUCCESS SAVED IMAGED ON DISK`);
            }
            else {
                throw new Error('Failed to save image on disk');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error in handleAvatarGeneration:', error.message);
            }
        }
    });
}
function uploadAvatarToSupabase(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pathIn = path_1.default.join(__dirname, '../../../backend/src/avatars');
            const fileOrigin = yield promises_1.default.readdir(pathIn);
            const filePath = path_1.default.join(pathIn, fileOrigin[0]);
            //  console.log( `FIRST IMPORTANT `)
            //  console.log(`filePath in uploadAvatarToSupabase: `, filePath)
            const fileBuffer = fs_1.default.readFileSync(filePath);
            const fileName = path_1.default.basename(filePath);
            //  console.log(`fileName in uploadAvatarToSupabase: `, fileName)
            //upload avatar to supabase
            const { data, error } = yield supabaseClient_1.supabase.storage.from('images').upload(fileName, fileBuffer, { contentType: 'image/png' });
            if (error) {
                console.log('uploadAvatarToSupabase - Error:', error.message);
                throw new Error('Failed to upload avatar to Supabase.');
            }
            //  console.log(`IMPORTANT-1`)
            //  console.log(`SUCCESS-1 File uploaded as: `, data.path)
            // generate a public URL for the uploaded file
            const { data: publicUrlData } = supabaseClient_1.supabase.storage.from('images').getPublicUrl(data.path);
            if (publicUrlData) {
                console.log(`SUCCESS-2 public URL: `, publicUrlData === null || publicUrlData === void 0 ? void 0 : publicUrlData.publicUrl);
            }
            const updatedUser = yield updateUser(userId, { avatar: publicUrlData === null || publicUrlData === void 0 ? void 0 : publicUrlData.publicUrl });
            console.log(`IMPORTANT updatedUser in uploadAvatarToSupabase: `);
            console.log(updatedUser);
            fs_1.default.unlinkSync(filePath);
            return updatedUser;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('CATCH: uploadAvatarToSupabase - Error:', error.message);
            }
            return null;
        }
    });
}
function readAvatarsFromDisk(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pathIn = path_1.default.join(__dirname, '../../../backend/src/avatar');
            const files = yield promises_1.default.readdir(pathIn);
            const userAvatar = files.find((file) => file.includes(userId));
            if (!userAvatar) {
                return null;
            }
            console.log(`userAvatar: `, userAvatar);
            const updatedUser = yield updateUser(userId, { avatar: userAvatar });
            return updatedUser;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('readAvatarFromDisk - Error:', error.message);
            }
            return null;
        }
    });
}
function updateUser(id, changes) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { avatar } = changes;
            const { data, error } = yield supabaseClient_1.supabase
                .from('users')
                .update({ avatar })
                .eq('id', id)
                .select("*")
                .single();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('updateUser - Error:', error);
            return null;
        }
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabaseClient_1.supabase
                .from('users')
                .select();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('getUsers - Error:', error);
            return null;
        }
    });
}
function getUserById(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabaseClient_1.supabase
                .from('users')
                .select()
                .eq('id', userid)
                .single();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('getUserById - Error:', error);
            return null;
        }
    });
}
function getUserByUname(uname) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabaseClient_1.supabase
                .from('users')
                .select()
                .eq('uname', uname)
                .single();
            if (error) {
                return null;
            }
            return data;
        }
        catch (error) {
            console.error('getUserByUname - Error:', error);
            return null;
        }
    });
}
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabaseClient_1.supabase
                .from('users')
                .select()
                .eq('email', email)
                .single();
            if (error) {
                return null;
            }
            return data;
        }
        catch (error) {
            console.error('getUserByEmail - Error:', error);
            return null;
        }
    });
}
function isUserValid(user, password) {
    return bcrypt_1.default.compareSync(password, user.password);
}
function getUserByEmailAndPassword(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield getUserByEmail(email);
            console.log('Retrieved user from getUserByEmailAndPassword:', user);
            if (!user || !user.password) {
                throw new Error(`No such user/email`);
            }
            const isPwdValid = bcrypt_1.default.compareSync(password, user.password);
            if (isPwdValid) {
                return user;
            }
            else {
                throw new Error(`Password is incorrect`);
            }
        }
        catch (error) {
            console.error('getUserByEmailAndPassword - Error:', error);
            return null;
        }
    });
}
function getUserByUnameOrEmail(uname, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabaseClient_1.supabase
                .from('users')
                .select()
                .or(`uname.eq.${uname},email.eq.${email}`)
                .single();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('getUserByUnameOrEmail - Error:', error);
            return null;
        }
    });
}
function resetPassword(info, newbarepassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = (yield getUserByEmail(info)) || (yield getUserByUname(info));
            if (!user) {
                throw new Error(`Couldn't find user with ${info}`);
            }
            const hashedPassword = bcrypt_1.default.hashSync(newbarepassword, saltValue);
            const { data, error } = yield supabaseClient_1.supabase
                .from('users')
                .update({ password: hashedPassword })
                .eq('id', user.id)
                .select()
                .single();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('resetPassword - Error:', error);
            return null;
        }
    });
}
