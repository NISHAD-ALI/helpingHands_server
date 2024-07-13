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
class chatController {
    constructor(chatUsecase) {
        this.chatUsecase = chatUsecase;
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const messages = yield this.chatUsecase.getMessages(id);
                res.status(200).json(messages);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message } = req.body;
                const { sender, group, content, communityId, conversation } = message;
                console.log(sender, group, content, communityId, conversation, "---");
                const data = yield this.chatUsecase.sendMessage(sender, group, content, conversation, communityId);
                res.status(201).json({ success: true, data });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    fetchConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const conversation = yield this.chatUsecase.fetchConversation(id);
                res.status(201).json(conversation);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.default = chatController;
