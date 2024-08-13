"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const conversationModel_1 = __importDefault(require("../database/conversationModel"));
const volunteerSchema = new mongoose_1.Schema({
    volunteerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const communitySchema = new mongoose_1.Schema({
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
        type: String,
        default: './src/assets/profile.jpg'
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'event',
            default: []
        }
    ],
    defaultConversation: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Conversation'
    }
});
// Middleware to create default conversation on community creation
communitySchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isNew) {
            next();
            return;
        }
        try {
            // Create a new conversation for the community
            const newConversation = new conversationModel_1.default({
                communityId: this._id,
                participants: this.volunteers.map(volunteer => volunteer.volunteerId)
            });
            const savedConversation = yield newConversation.save();
            // Assign the created conversation's ID as default conversation
            this.defaultConversation = savedConversation._id;
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
const communityModel = (0, mongoose_1.model)('community', communitySchema);
exports.default = communityModel;
