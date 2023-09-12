const express = require('express');
const config = require('./config/config')[process.env.NODE_ENV];
const socketio = require('socket.io');
const { sockets } = require('./utils/sockets');

const app = express();

// Setup express server
require('./config/express.config')(app);

const server = app.listen(config.PORT, () => console.log('Server is listening on port: ' + config.PORT));

global.io = socketio(server, {
    cors: {
        origin: ['http://localhost:3001']
    }
});

global.io.on('connection', sockets.connection);