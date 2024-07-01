import mongoose, { Schema, model } from "mongoose";

const reportPostSchema: Schema = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
        required: true
    },
    reportedUsers: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            reason: {
                type: String,
            }
        }
    ]
});

const reportPostModel = model('reportPost', reportPostSchema);

export default reportPostModel;
