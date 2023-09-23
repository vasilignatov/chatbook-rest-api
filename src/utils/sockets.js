exports.sockets = {
    users: [],

    connection(socket) {
        socket.on('disconect', () => {
            this.users = this.users.filter(user => user.socketId !== socket.id);
        });

        socket.on('identity', (userId) => {
            console.log('identity emited: ', userId);
            this.users.push({
                socketId: socket.id,
                userId
            });
        });

        socket.on('subscribe', (room, otherUserId) => {
            console.log('ROOM: ', room);
            console.log('Other User ID: ', otherUserId);
            this.subscribeToOtherUser(room, otherUserId);
        });
    },

    subscribeToOtherUser(room, otherUserId) {
        const userSockets = this.users.filter(user => user.userId === otherUserId);

        userSockets.map((userInfo) => {
            const socketConn = global.io.sockets.connected(userInfo.socketId);
            if (socketConn) {
                socketConn.join(room);
            }
        });
    }
}