exports.sockets = {
    users: [],

    connection(socket) {
        socket.on('disconect', () => {
            this.users = this.users.filter(user => user.socketId !== client.id);
        });

        socket.on('identity', (userId) => {
            this.users.push({
                socketId: client.id,
                userId
            });
        });

        socket.on('subscribe', (room, otherUserId) => {
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