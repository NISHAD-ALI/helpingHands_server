import mongoose, { Schema, model } from "mongoose";
import volunteer from "../../entities/volunteer";

const volunteerSchema: Schema<volunteer> = new Schema({
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
        type: String,
         default: './src/assets/profile.jpg'
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    events: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'event',
            default: []
        }
    ],
    bloodGroup:{
        type:String,
    },
    about:{
        type:String,
    },
    communities:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'community',
            default: []
        }
    ]

})

const volunteerModel = model<volunteer>('volunteer', volunteerSchema);

export default volunteerModel;

