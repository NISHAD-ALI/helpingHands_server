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
Object.defineProperty(exports, "__esModule", { value: true });
class chatUsecase {
    constructor(chatRepo) {
        this.chatRepo = chatRepo;
    }
    getMessages(conversation) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.chatRepo.getMessagesByConversation(conversation);
            return response;
        });
    }
    sendMessage(sender, group, content, conversation, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.chatRepo.saveMessage(sender, group, content, conversation, communityId);
        });
    }
    fetchConversation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this.chatRepo.fetchConversations(id);
                return response;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.default = chatUsecase;
