const mongoose = require('mongoose');
const toJSON = require('@meanie/mongoose-to-json');

const messageSchema = new mongoose.Schema(
    {
        chatRoomId: mongoose.Schema.Types.ObjectId,
        postedByUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: String,
    },
    {
        timestamps: true
    }
);

// messageSchema.plugin(toJSON);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;