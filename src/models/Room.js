const mongoose = require('mongoose');
const toJSON = require('@meanie/mongoose-to-json');

const roomSchema = new mongoose.Schema({
    userIds: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    type: {
        type: String,
        enum: ['c2c', 'group'],
        required: true
    },
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

roomSchema.plugin(toJSON);

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
