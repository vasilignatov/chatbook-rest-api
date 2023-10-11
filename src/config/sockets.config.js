const socketio = require('socket.io');
const chatService = require('../services/chat.service');

function socketInit(server) {

    const io = socketio(server, {
        cors: {
            origin: ['http://localhost:3000'],
            credentials: true
        }
    });

    let onlineUsers = [];

    io.on('connection', (socket) => {

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
            // update all online users after new user is connected 
            io.emit('online_users', onlineUsers);
        });

        socket.on('join_room', (roomId, otherUserId) => {
            // cheching if the room exists
            if ((socket.rooms).has(roomId)) {
                // if exist first leave it
                socket.leave(roomId);
            }

            console.log('------socket join room: ', roomId);
            socket.join(roomId);
        });

        socket.on('leave_room', (roomId) => {
            console.log('------socket left room: ', roomId);
            socket.leave(roomId);
        });

        socket.on('send_message', async (message) => {
            const { roomId, senderId, text } = message;
            try {
                const messageRecord = await chatService.createPostInChatRoom(roomId, text, senderId)
                io.sockets.to(roomId).emit('receive_message', messageRecord);
            } catch (err) {
                console.log('Message record faild: ', err);
                socket.emit('server_error', { status: 500, message: 'Initial server error!' });
            }
        });

        socket.on('user_typing', (roomId, isTyping) => {
            if(isTyping) {
                socket.in(roomId).emit('typing_notify', true);
            } else {
                socket.in(roomId).emit('typing_notify', false);
            }
        });
    });
}

module.exports = socketInit;