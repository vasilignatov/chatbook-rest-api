const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const chatService = require('../services/chat.service');
const userService = require('../services/user.service');
const AppError = require('../utils/AppError');

const initiate = catchAsync(async (req, res) => {
    const { userIds, type } = req.body;
    const chatInitiator = req.user._id.toString();
    const allUserIds = [...userIds, chatInitiator];   
    const chatRoom = await chatService.initiateChat(allUserIds, type, chatInitiator);

    res
        .status(httpStatus.OK)
        .json(chatRoom);
});

const postMessage = catchAsync(async (req, res) => {
    const { roomId } = req.params;
    const { text } = req.body;
    
    const userId = req.user._id.toString();
    const post = await chatService.createPostInChatRoom(roomId, text, userId);

    
});

const getRecentChat = catchAsync(async (req, res) => {
    const userId = req.user._id.toString();

    const rooms = await chatService.getChatRoomsByUserId(userId);
    const roomIds = rooms.map(room => room._id);

    const recentChat = await chatService.getRecentChat(roomIds, userId);

    res
        .status(httpStatus.OK)
        .json(recentChat);
});

const getChatByRoomId = catchAsync(async (req, res) => {
    const { roomId } = req.params;

    const room = await chatService.getChatRoomByRoomId(roomId);

    if (!room) {
        throw new AppError('No room exist for this id', httpStatus.BAD_REQUEST);
    }

    const users = await userService.getUsersByIds(room.userIds);
    const chatMessages = await chatService.getChatByRoomId(roomId);

    res
        .status(httpStatus.OK)
        .json({ chatMessages, users });
});

module.exports = {
    initiate,
    postMessage,
    getRecentChat,
    getChatByRoomId,
}