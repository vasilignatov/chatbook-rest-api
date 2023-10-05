const socketio = require('socket.io');

function socketInit(server) {

    const io = socketio(server, {
        cors: {
            origin: ['http://localhost:3000'],
            credentials: true
        }
    });

    let onlineUsers = [];

    io.on('connection', (socket) => {
        console.log(socket.id, 'is connected');

        socket.on('disconnect', (userId) => {
            console.log('disconect: ', userId);
            // decrease online users 
            onlineUsers = onlineUsers.filter(user => user.userId !== userId);
            // update all online users after user is disconnected 
            io.emit('online_users', onlineUsers);
        });

        socket.on('identity', (userId) => {
            console.log('identity emited: ', userId);
            // add user to onlineUsers array
            const isUserExist = onlineUsers.some(user => user.userId === userId);
            // if user is already online 
            if (isUserExist) {
                onlineUsers = onlineUsers.map(user => {
                    return user.userId === userId
                        ? ({ ...user, socketId: socket.id })
                        : user
                });
            } else {
                onlineUsers.push({
                    userId,
                    socketId: socket.id
                });
            }
            console.log(onlineUsers);
            // update all online users after new user is connected 
            io.emit('online_users', onlineUsers);
        });

        socket.on('join_room', (roomId, otherUserId) => {
            console.log(socket.rooms);
            // cheching if the room exists
            const currentRoom = Object.keys(socket.rooms).find(room => room !== socket.id);
            if (currentRoom == roomId) return;

            if (currentRoom) socket.leave(roomid);

            socket.join(roomId);
        });

        socket.on('leave_room', (roomId) => {
            console.log('leave room: ', roomId);
            socket.leave(roomId);
        });

        socket.on('send_message', (message) => {

        });

        socket.on('typing', (room) => {
            socket.in(room).emit();
        });

        socket.on('stop_typing', (room) => {
            socket.in(room).emit();
        });
    });
}

module.exports = socketInit;