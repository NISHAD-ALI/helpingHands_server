import mongoose, { Schema, model, Document } from "mongoose";

interface Volunteer {
    volunteerId: mongoose.Types.ObjectId;
    is_accepted: boolean;
    date?: Date; 
}

interface Community extends Document {
    name: string;
    email: string;
    password?: string;
    phone?: number;
    volunteers: Volunteer[];
    profileImage?: string;
    about?: string;
    is_blocked: boolean;
    events: mongoose.Types.ObjectId[];
}

const volunteerSchema: Schema<Volunteer> = new Schema({
    volunteerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'volunteer',
        required: true
    },
    is_accepted: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date
    }
});

const communitySchema: Schema<Community> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    phone: {
        type: Number
    },
    volunteers: [volunteerSchema],
    profileImage: {
        type: String
    },
    about: {
        type: String
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
    ]
});

const communityModel = model<Community>('community', communitySchema);

export default communityModel;
