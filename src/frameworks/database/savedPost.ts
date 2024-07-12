import mongoose, { Schema, model } from "mongoose";
import savedPost from "../../entities/savedPosts";


const savedPostSchema: Schema<savedPost> = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    postId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Posts',
            default:[]
        }
    ]



})

const savedPost = model<savedPost>('savedPost', savedPostSchema);

export default savedPost;

