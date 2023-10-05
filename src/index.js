const express = require('express');
const config = require('./config/config')[process.env.NODE_ENV];

const app = express();

// Setup express server
require('./config/express.config')(app);

const server = app.listen(config.PORT, () => console.log('Server is listening on port: ' + config.PORT));

// Setup socket.io
require('./config/sockets.config')(server);
