import mongoose, { Schema, model } from "mongoose";
import user from "../../entities/user"

const userSchema: Schema<user> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    password: {
        type: String,
    },
    phone: {
        type: Number,

    },
    profileImage: {
        type: String
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Posts',
            default: []
        }
    ],
    donationsFund: {
        type: Number,
        default: 0
    },
    donationsEssentials: {
        type: Number,
        default: 0
    },

})

const userModel = model<user>('user', userSchema);

export default userModel;

