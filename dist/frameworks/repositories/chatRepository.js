"use strict";
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
const messageModel_1 = __importDefault(require("../database/messageModel"));
const conversationModel_1 = __importDefault(require("../database/conversationModel"));
class chatRepository {
    getMessagesByConversation(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield messageModel_1.default.find({ conversation: conversationId })
                .populate('group')
                .populate('sender');
            return data;
        });
    }
    saveMessage(sender, group, content, conversation, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = new messageModel_1.default({
                    sender,
                    conversation: conversation,
                    content,
                    timestamp: new Date(),
                    group: communityId
                });
                yield newMessage.save();
                return newMessage;
            }
            catch (error) {
                console.error("Error saving message:", error);
                throw error;
            }
        });
    }
    fetchConversations(volunteerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield conversationModel_1.default.find({ participants: { $in: volunteerId } })
                    .populate('communityId')
                    .populate('participants');
                return conversations;
            }
            catch (error) {
                console.error("Error fetching conversation:", error);
                throw error;
            }
        });
    }
}
exports.default = chatRepository;
