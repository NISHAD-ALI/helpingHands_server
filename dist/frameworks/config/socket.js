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
const socket_io_1 = require("socket.io");
function socketServer(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
        }
    });
    io.on('connection', (socket) => {
        socket.on('joinGroup', (groupId) => {
            socket.join(groupId);
        });
        socket.on('sendMessage', (data) => __awaiter(this, void 0, void 0, function* () {
            const { group, content, conversation, communityId } = data;
            io.to(group).emit('receiveMessage', data);
            io.emit('receiveNotification', { message: content });
        }));
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}
exports.default = socketServer;
