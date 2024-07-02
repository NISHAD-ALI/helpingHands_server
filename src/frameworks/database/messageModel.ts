import mongoose, { Schema, model } from "mongoose";
import message from "../../entities/message";

const messageSchema:Schema<message> = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'volunteer',
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'community',
    }
});

const messageModel = model<message>('message', messageSchema);

export default messageModel;
