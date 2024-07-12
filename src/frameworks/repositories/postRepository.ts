import postModel from "../database/postModel";
import post from "../../entities/post";
import userModel from "../database/userModel";
import IPostInterface from "../../useCases/interfaces/IPostInterface";
import mongoose from "mongoose";
import comment from "../../entities/comment";
import reportPostModel from "../database/reportPostModel";
import savedPost from "../database/savedPost";
import SavedPost from "../../entities/savedPosts";

class postRepository implements IPostInterface {

    async createPost(post: post): Promise<post | null> {
        try {
            let newPost = new postModel(post);
            await newPost.save();
            await userModel.updateOne(
                { _id: newPost.userId },
                { $push: { posts: newPost._id } }
            );
            return newPost ? newPost.toObject() : null;
        } catch (error: any) {
            console.error("Error creating post:", error.message);
            throw new Error('Unable to create post');
        }
    }
    async getPostsOne(id: string): Promise<post | null> {
        try {
            let data: any = await userModel.findOne({ _id: id }).populate('posts');
            return data
        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to fetch list of posts')
        }
    }
    async getPosts(): Promise<post | null> {
        try {
            let data: any = await postModel.find({}).sort({ postedDate: -1 }).populate('userId')
            return data
        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to fetch list of posts')
        }
    }
    async deletePost(id: string, userId: string): Promise<boolean | null> {
        try {
            let post = await postModel.deleteOne({ _id: id });
            if (post.acknowledged) {
                let user = await userModel.updateOne(
                    { _id: userId },
                    { $pull: { posts: id } }
                );
                console.log(user)
                let reportDeletionResult = await reportPostModel.deleteMany({ postId: id });
                console.log('Reports deleted:', reportDeletionResult);
            }

            return post.acknowledged;
        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to delete post')
        }
    }
    async editPost(id: string, postData: Partial<post>): Promise<boolean> {
        try {
            let newData = await postModel.updateOne({ _id: id }, postData, { new: true })
            return newData.acknowledged
        } catch (error: any) {
            console.error("Error updating post:", error.message);
            throw new Error('Unable to update post');
        }
    }
    async likePost(id: string, userId: string): Promise<boolean | null> {
        try {
            const userObjectId = new mongoose.Types.ObjectId(userId);

            const post = await postModel.findById(id);
            if (!post) {
                throw new Error('Post not found');
            }

            const likes = post.likes ?? [];
            const userLiked = likes.some((like: any) => like.equals(userObjectId));

            if (userLiked) {
                await postModel.updateOne(
                    { _id: id },
                    { $pull: { likes: userObjectId } }
                );
            } else {
                await postModel.updateOne(
                    { _id: id },
                    { $push: { likes: userObjectId } }
                );
            }

            return true;
        } catch (error: any) {
            console.error(error.message);
            throw new Error('Unable to update likes on the post');
        }
    }
    async isLiked(id: string, userId: string): Promise<boolean | null> {
        try {

            const post = await postModel.findOne({ _id: id });
            if (post?.likes?.includes(userId as any)) {
                return true
            } else {
                return false
            }

        } catch (error: any) {
            console.error(error.message);
            throw new Error('Unable to update likes on the post');
        }
    }
    async addComment(postId: string, comment: any): Promise<boolean> {
        try {
            const post = await postModel.findById(postId);
            if (!post) {
                throw new Error('Post not found');
            }

            post.comments?.push(comment)
            await post.save();

            return true;
        } catch (error: any) {
            console.error('Error adding comment:', error.message);
            throw new Error(error.message || 'Failed to add comment');
        }
    }
    async getComments(postId: string): Promise<post | null> {
        try {
            const post = await postModel.findById(postId).populate('comments.userId')
            if (!post) {
                throw new Error('Post not found');
            }
            return post;
        } catch (error: any) {
            console.error('Error adding comment:', error.message);
            throw new Error(error.message || 'Failed to add comment');
        }
    }
    async reportPost(postId: string, userId: string, message: string): Promise<boolean> {
        try {
            const userObjectId = new mongoose.Types.ObjectId(userId);
            const postObjectId = new mongoose.Types.ObjectId(postId);
            const newReport = new reportPostModel({
                postId: postObjectId,
                reportedUsers: [
                    {
                        userId: userObjectId,
                        reason: message
                    }
                ]
            });
            await newReport.save();

            return true;
        } catch (error: any) {
            console.error('Error reporting post:', error);
            throw new Error(error.message || 'Failed to report post');
        }
    }
    async getAllReportedPosts(): Promise<post | null> {
        try {
            let data: any = await reportPostModel.find({}).sort({ _id: -1 }).populate('postId')
            return data
        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to fetch list of reportedposts')
        }
    }
    async savedPost(post: post,userId:string): Promise<boolean | null> {
        try {
            let newSave = {
                userId: post.userId,
                postId: post._id
            };
            
            const alreadySaved = await savedPost.findOne({ userId:userId });
           console.log("ALREADY SAVED--->",alreadySaved?.postId)
            if (alreadySaved?.postId?.includes(new mongoose.Schema.Types.ObjectId(newSave.postId as string) )) {
                throw new Error('Post already saved');
            }
            else {
                const result = await savedPost.updateOne(
                    { userId: userId },
                    { $push: { postId: newSave.postId } },
                    { upsert: true }
                );

                return true
            }
        } catch (error: any) {
            console.error("Error saving post:", error.message);
            throw new Error(error.message);
        }
    }

    async getSavedPosts(id: string): Promise<any | null> {
        try {
 console.log('----------------------------')
            console.log(id)
            console.log('----------------------------')
            let data = await savedPost.findOne( {userId:id} ).populate('postId');
            return data;
        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to fetch list of posts')
        }
    }
}

export default postRepository