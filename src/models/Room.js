const mongoose = require('mongoose');
const toJSON = require('@meanie/mongoose-to-json');

const roomSchema = new mongoose.Schema({
    userIds: [mongoose.Schema.Types.ObjectId],
    type: {
        type: String,
        enum: ['c2c', 'group'] 
    },
    initiator: mongoose.Schema.Types.ObjectId
}, {
    timestamps: true
});

roomSchema.plugin(toJSON);

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
