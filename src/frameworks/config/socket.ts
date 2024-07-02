import { Server, Socket } from 'socket.io';

function socketServer(server: any) {
    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinGroup', (groupId) => {
            console.log(`User joined group ${groupId}`);
            socket.join(groupId);
        });

        socket.on('sendMessage', async (data) => {
            console.log('sendMessage event received:', data);
            const { group, content, conversation, communityId } = data;
            console.log(`Broadcasting message to group ${group}`);
            io.to(group).emit('receiveMessage', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

export default socketServer;
