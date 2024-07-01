import mongoose, { Schema, model } from "mongoose";
import post from "../../entities/post";
import comment from "../../entities/comment";


const commentSchema: Schema<comment> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt:{
        type:Date
    },
    message:{
        type:String
    }

});


const postSchema: Schema<post> = new Schema({
    title: {
        type: String,
        required: true
    },
    comments:[commentSchema],
    image:{
        type:String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    postedDate: { 
        type: Date,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: []
        }
    ]


})

const postModel = model<post>('Posts', postSchema);

export default postModel;

