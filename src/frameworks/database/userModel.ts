import { Schema, model } from "mongoose";
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
        type: Number
    },
    profileImage: {
        type: String
    },
    is_blocked: {
        type: Boolean,
        default: false
    },

})

const userModel = model<user>('user', userSchema);

export default userModel;

