import mongoose, { Schema, model, Document } from "mongoose";
import ConversationModel from "../database/conversationModel";

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
    defaultConversation: mongoose.Types.ObjectId;
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
    ],
    defaultConversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    }
});

// Middleware to create default conversation on community creation
communitySchema.pre<Community>('save', async function(next) {
    if (!this.isNew) {
        next();
        return;
    }

    try {
        // Create a new conversation for the community
        const newConversation = new ConversationModel({
            communityId: this._id,
            participants: this.volunteers.map(volunteer => volunteer.volunteerId)
        });

        const savedConversation = await newConversation.save();

        // Assign the created conversation's ID as default conversation
        this.defaultConversation = savedConversation._id;

        next();
    } catch (error:any) {
        next(error);
    }
});

const communityModel = model<Community>('community', communitySchema);

export default communityModel;
