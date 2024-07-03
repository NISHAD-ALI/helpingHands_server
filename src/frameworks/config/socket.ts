import { Server, Socket } from 'socket.io';

function socketServer(server: any) {
    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket: Socket) => {
        socket.on('joinGroup', (groupId) => {
            socket.join(groupId);
        });

        socket.on('sendMessage', async (data) => {
            const { group, content, conversation, communityId } = data;
            io.to(group).emit('receiveMessage', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

export default socketServer;
