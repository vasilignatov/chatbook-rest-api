const mongoose = require('mongoose');
const toJSON = require('@meanie/mongoose-to-json');

const messageSchema = new mongoose.Schema(
    {
        chatRoomId: {
            type: mongoose.Schema.Types.ObjectId
        },
        postedByUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            minlength: 1,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// messageSchema.plugin(toJSON);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;