const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const chatServise = require('../services/chat.service');
const userServise = require('../services/user.service');
const AppError = require('../utils/AppError');

const initiate = catchAsync(async (req, res) => {
    const { userIds, type } = req.body;
    const chatInitiator = req.user._id;
    const allUserIds = [...userIds, chatInitiator];
    const chatRoom = await chatServise.initiateChat(allUserIds, type, chatInitiator);

    res
        .status(httpStatus.OK)
        .json({ chatRoom });
});

const postMessage = catchAsync(async (req, res) => {
    const { roomId } = req.params;

    const { text } = req.body;

    const userId = req.user._id;
    const post = await chatServise.createPostInChatRoom(roomId, text, userId);

    // emit new message to the room
    global.io.sockets.in(roomId).emit('new-message', { message: post });
});

const getRecentChat = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const rooms = await chatServise.getChatRoomsByUserId(userId);
    console.log(rooms);

    const roomIds = rooms.map(room => room._id);
    console.log(roomIds);

    const recentChat = await chatServise.getRecentChat(roomIds, userId);

    res
        .status(httpStatus.OK)
        .json({
            chat: recentChat
        });
});

const getChatByRoomId = catchAsync(async (req, res) => {
    const { roomId } = req.params;

    const room = await chatServise.getConversationByRoomId(roomId);

    if (!room) {
        throw new AppError('No room exist for this id', httpStatus.BAD_REQUEST);
    }

    const user = userServise.getUsersByIds(room.userIds);
    const chat = await chatServise.getChatByRoomId(roomId);

    res
        .status(httpStatus.OK)
        .json({ chat, user });
});


module.exports = {
    initiate,
    postMessage,
    getRecentChat,
    getChatByRoomId,
}