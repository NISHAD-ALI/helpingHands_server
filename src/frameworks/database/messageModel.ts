import mongoose, { Schema, model } from "mongoose";
import message from "../../entities/message";

const messageSchema:Schema<message> = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'volunteer',
        required: true
    },
    group: {
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
    }
});

const messageModel = model<message>('message', messageSchema);

export default messageModel;
