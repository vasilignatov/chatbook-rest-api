const mongoose = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');

const messageSchema = new mongoose.Schema({
    roomId: mongoose.Schema.Types.ObjectId,
    postedBy: mongoose.Schema.Types.ObjectId,
    readBy: [mongoose.Schema.Types.ObjectId],
    text: String
}, { timestamps: true });

tokenSchema.plugin(toJSON);

const Message = mongoose.model('Room', messageSchema);
module.exports = Message;