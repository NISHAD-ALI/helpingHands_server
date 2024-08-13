"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const donationSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String
    },
    details: {
        type: String
    },
    image: {
        type: String
    },
    targetAmount: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    type: {
        type: String
    },
    amountCollected: {
        type: Number,
        default: 0
    },
    donatedUsers: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'user',
        }
    ],
    is_active: {
        type: Boolean,
        default: true
    }
});
const donationModel = mongoose_1.default.model('donations', donationSchema);
exports.default = donationModel;
