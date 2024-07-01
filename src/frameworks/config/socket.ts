import { Server, Socket } from 'socket.io'

function socketServer (server:any){
    const io = new Server(server, {
        cors: {
            origin: '*'
        }
    });
    io.on('connection', (socket) => {
        console.log('a user connected');
      
        socket.on('joinGroup', (groupId) => {
          socket.join(groupId);
        });
      
        socket.on('sendMessage', async (data) => {
            console.log(data)
          const { sender, group, content } = data;

          io.to(group).emit('receiveMessage',  { sender, group, content });
        });
      
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });
      });
      

}


export default socketServer