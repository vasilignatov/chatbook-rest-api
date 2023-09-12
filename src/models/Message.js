const mongoose = require('mongoose');
const toJSON = require('@meanie/mongoose-to-json');

const messageSchema = new mongoose.Schema(
    {
        chatRoomId: mongoose.Schema.Types.ObjectId,
        postedByUserId: mongoose.Schema.Types.ObjectId,
        text: String,
        // readBy: [mongoose.Schema.Types.ObjectId],
    },
    {
        timestamps: true
    }
);

messageSchema.plugin(toJSON);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;