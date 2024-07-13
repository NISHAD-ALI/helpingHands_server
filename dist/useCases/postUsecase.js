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
class postUsecase {
    constructor(postRepo, cloudinary, jwt) {
        this.postRepo = postRepo;
        this.cloudinary = cloudinary;
        this.jwt = jwt;
    }
    createEvent(postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let image = postData.image;
                let uploadImages = yield this.cloudinary.uploadImageToCloud(image);
                postData.image = uploadImages;
                let response = yield this.postRepo.createPost(postData);
                console.log(response + "->api response");
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getPostsOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.postRepo.getPostsOne(id);
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.postRepo.getPosts();
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    editPost(id, postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let uploadFile = yield this.cloudinary.uploadImageToCloud(postData.image);
                postData.image = uploadFile;
                let response = yield this.postRepo.editPost(id, postData);
                console.log(response + "->api response");
                return response;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    deletePost(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.postRepo.deletePost(id, userId);
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    likePost(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.postRepo.likePost(id, userId);
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    isLiked(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.postRepo.isLiked(id, userId);
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    addComment(postId, userId, message, createdAt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = {
                    userId,
                    message,
                    createdAt
                };
                const commented = yield this.postRepo.addComment(postId, comment);
                if (commented) {
                    return true;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.postRepo.getComments(postId);
                return data === null || data === void 0 ? void 0 : data.comments;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    reportPost(postId, userId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.postRepo.reportPost(postId, userId, message);
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    savePost(postData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this.postRepo.savedPost(postData, userId);
                console.log(response + "->api response");
                return response;
            }
            catch (error) {
                console.log("EEE", error);
                throw error;
            }
        });
    }
    getSavedPosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.postRepo.getSavedPosts(id);
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = postUsecase;
