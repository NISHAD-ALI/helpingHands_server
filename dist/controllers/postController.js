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
class postController {
    constructor(postUsecase, jwt) {
        this.postUsecase = postUsecase;
        this.jwt = jwt;
    }
    createEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title } = req.body;
                const createDate = Date.now();
                let image = req.file;
                const token = req.cookies.userToken;
                let userId;
                try {
                    const payload = this.jwt.verifyToken(token);
                    if (payload) {
                        userId = payload.id;
                    }
                    else {
                        throw new Error('Invalid token or missing payload');
                    }
                }
                catch (error) {
                    console.error('Error verifying token:', error);
                    return res.status(401).json({ success: false, message: 'Invalid token' });
                }
                const postData = {
                    image: image,
                    title: title,
                    userId: userId,
                    postedDate: createDate
                };
                const data = yield this.postUsecase.createEvent(postData);
                if (data) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Cannot Create post!' });
                }
            }
            catch (error) {
                console.error('Error creating post:', error);
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getPostsOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.userToken;
                let userId;
                try {
                    const payload = this.jwt.verifyToken(token);
                    if (payload) {
                        userId = payload.id;
                    }
                    else {
                        throw new Error('Invalid token or missing payload');
                    }
                }
                catch (error) {
                    console.error('Error verifying token:', error);
                    return res.status(401).json({ success: false, message: 'Invalid token' });
                }
                let posts = yield this.postUsecase.getPostsOne(userId);
                if (posts) {
                    res.status(200).json({ success: true, posts });
                }
                else {
                    res.status(500).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let posts = yield this.postUsecase.getAllPosts();
                if (posts) {
                    res.status(200).json({ success: true, posts });
                }
                else {
                    res.status(500).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    editPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, title } = req.body;
                let newImage = req.file;
                const newData = {
                    title: title,
                    image: newImage
                };
                if (newData) {
                    let updated = yield this.postUsecase.editPost(id, newData);
                    if (updated) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Cannot update user profile!' });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: "Something went wrong!Try again!" });
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const postId = req.params.id;
                let post = yield this.postUsecase.deletePost(postId, userId);
                if (!post) {
                    res.status(401).json({ success: false, message: 'No post to delete' });
                }
                else {
                    res.status(200).json({ success: true, post });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const postId = req.params.id;
                let post = yield this.postUsecase.likePost(postId, userId);
                if (!post) {
                    res.status(401).json({ success: false, message: 'No post to delete' });
                }
                else {
                    res.status(200).json({ success: true, post });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    isLiked(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const postId = req.params.id;
                let post = yield this.postUsecase.isLiked(postId, userId);
                res.status(200).json({ post });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    addComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message } = req.body;
                const userId = req.userId;
                const date = new Date();
                const postId = req.params.id;
                const response = yield this.postUsecase.addComment(postId, userId, message, date);
                if (response) {
                    res.status(200).json({ success: true });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id;
                let data = yield this.postUsecase.getComments(postId);
                if (data) {
                    res.status(200).json({ success: true, data });
                }
                else {
                    res.status(500).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    reportPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, message } = req.body;
                let userId = req.userId;
                const response = yield this.postUsecase.reportPost(postId, userId, message);
                if (response) {
                    res.status(200).json({ success: true });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    savePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.userId;
                const { post } = req.body;
                const response = yield this.postUsecase.savePost(post, userId);
                if (response) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Cannot save post!' });
                }
            }
            catch (error) {
                console.error('Error saving post:', error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    getSavedPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.userId;
                let posts = yield this.postUsecase.getSavedPosts(userId);
                if (posts) {
                    res.status(200).json({ success: true, posts });
                }
                else {
                    res.status(500).json({ success: false, message: "Internal server error2" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error1" });
            }
        });
    }
}
exports.default = postController;
