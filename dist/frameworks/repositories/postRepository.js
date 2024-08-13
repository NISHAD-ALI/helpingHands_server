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
const postModel_1 = __importDefault(require("../database/postModel"));
const userModel_1 = __importDefault(require("../database/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const reportPostModel_1 = __importDefault(require("../database/reportPostModel"));
const savedPost_1 = __importDefault(require("../database/savedPost"));
class postRepository {
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newPost = new postModel_1.default(post);
                yield newPost.save();
                yield userModel_1.default.updateOne({ _id: newPost.userId }, { $push: { posts: newPost._id } });
                return newPost ? newPost.toObject() : null;
            }
            catch (error) {
                console.error("Error creating post:", error.message);
                throw new Error('Unable to create post');
            }
        });
    }
    getPostsOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield userModel_1.default.findOne({ _id: id }).populate('posts');
                return data;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch list of posts');
            }
        });
    }
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield postModel_1.default.find({}).sort({ postedDate: -1 }).populate('userId');
                return data;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch list of posts');
            }
        });
    }
    deletePost(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let post = yield postModel_1.default.deleteOne({ _id: id });
                if (post.acknowledged) {
                    let user = yield userModel_1.default.updateOne({ _id: userId }, { $pull: { posts: id } });
                    let reportDeletionResult = yield reportPostModel_1.default.deleteMany({ postId: id });
                }
                return post.acknowledged;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to delete post');
            }
        });
    }
    editPost(id, postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newData = yield postModel_1.default.updateOne({ _id: id }, postData, { new: true });
                return newData.acknowledged;
            }
            catch (error) {
                console.error("Error updating post:", error.message);
                throw new Error('Unable to update post');
            }
        });
    }
    likePost(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                const post = yield postModel_1.default.findById(id);
                if (!post) {
                    throw new Error('Post not found');
                }
                const likes = (_a = post.likes) !== null && _a !== void 0 ? _a : [];
                const userLiked = likes.some((like) => like.equals(userObjectId));
                if (userLiked) {
                    yield postModel_1.default.updateOne({ _id: id }, { $pull: { likes: userObjectId } });
                }
                else {
                    yield postModel_1.default.updateOne({ _id: id }, { $push: { likes: userObjectId } });
                }
                return true;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('Unable to update likes on the post');
            }
        });
    }
    isLiked(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const post = yield postModel_1.default.findOne({ _id: id });
                if ((_a = post === null || post === void 0 ? void 0 : post.likes) === null || _a === void 0 ? void 0 : _a.includes(userId)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error(error.message);
                throw new Error('Unable to update likes on the post');
            }
        });
    }
    addComment(postId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const post = yield postModel_1.default.findById(postId);
                if (!post) {
                    throw new Error('Post not found');
                }
                (_a = post.comments) === null || _a === void 0 ? void 0 : _a.push(comment);
                yield post.save();
                return true;
            }
            catch (error) {
                console.error('Error adding comment:', error.message);
                throw new Error(error.message || 'Failed to add comment');
            }
        });
    }
    getComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postModel_1.default.findById(postId).populate('comments.userId');
                if (!post) {
                    throw new Error('Post not found');
                }
                return post;
            }
            catch (error) {
                console.error('Error adding comment:', error.message);
                throw new Error(error.message || 'Failed to add comment');
            }
        });
    }
    reportPost(postId, userId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                const postObjectId = new mongoose_1.default.Types.ObjectId(postId);
                const newReport = new reportPostModel_1.default({
                    postId: postObjectId,
                    reportedUsers: [
                        {
                            userId: userObjectId,
                            reason: message
                        }
                    ]
                });
                yield newReport.save();
                return true;
            }
            catch (error) {
                console.error('Error reporting post:', error);
                throw new Error(error.message || 'Failed to report post');
            }
        });
    }
    getAllReportedPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield reportPostModel_1.default.find({}).sort({ _id: -1 }).populate('postId');
                return data;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch list of reportedposts');
            }
        });
    }
    savedPost(post, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let newSave = {
                    userId: post.userId,
                    postId: post._id
                };
                const alreadySaved = yield savedPost_1.default.findOne({ userId: userId });
                if ((_a = alreadySaved === null || alreadySaved === void 0 ? void 0 : alreadySaved.postId) === null || _a === void 0 ? void 0 : _a.includes(new mongoose_1.default.Schema.Types.ObjectId(newSave.postId))) {
                    throw new Error('Post already saved');
                }
                else {
                    const result = yield savedPost_1.default.updateOne({ userId: userId }, { $push: { postId: newSave.postId } }, { upsert: true });
                    return true;
                }
            }
            catch (error) {
                console.error("Error saving post:", error.message);
                throw new Error(error.message);
            }
        });
    }
    getSavedPosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield savedPost_1.default.findOne({ userId: id }).populate('postId');
                return data;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch list of posts');
            }
        });
    }
}
exports.default = postRepository;
