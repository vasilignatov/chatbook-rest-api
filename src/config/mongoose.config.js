const mongoose = require('mongoose');
const config = require('./config')[process.env.NODE_ENV];

function dbConnect() {
    mongoose.set('strictQuery', false);

    mongoose.connect(config.MONGODB_URL);

    mongoose.connection.on('connected', () => {
        console.log('Mongo has connected succesfully')
    });

    mongoose.connection.on('reconnected', () => {
        console.log('Mongo has reconnected')
    });

    mongoose.connection.on('error', error => {
        console.log('Mongo connection has an error', error)
        mongoose.disconnect();
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongo connection is disconnected')
    });
}

module.exports = dbConnect;