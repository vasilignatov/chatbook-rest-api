const express = require('express');
const dbConfig = require('./config/mongoose.config');
const config = require('./config/config')[process.env.NODE_ENV];
const socketio = require('socket.io');

const app = express();
// const server = http.createServer(app);
// Setup express server
require('./config/express.config')(app);

dbConfig(config.MONGODB_URL)
    .then(() => {
        console.log('DB connected!');
        const server = app.listen(config.PORT, () => console.log('Server is listening on port: ' + config.PORT));
        const io = socketio(server);
        app.set('io', io);
    })
    .catch(err => {
        console.log('DB connection error: ', err);
    });