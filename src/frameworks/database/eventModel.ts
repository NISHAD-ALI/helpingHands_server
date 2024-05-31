import mongoose, { Schema, model } from "mongoose";
import events from "../../entities/events";

const eventSchema: Schema<events> = new Schema({
    name: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    images: {
        type: [String],
    },
    video: {
        type: String,
    },
    volunteers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'volunteer',
        }
    ],
    communId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'community',
    },
    shifts: [
        {
            date: { type: String, required: true },
            timeSlot: { type: String, required: true }
        }
    ],
    volunteerCount:{
        type:String,
    },
});

const eventModel = model<events>('event', eventSchema);

export default eventModel;
