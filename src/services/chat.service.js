const Message = require('../models/Message');
const Room = require('../models/Room');

const getChatRoomsByUserId = async (userId) => {
    const rooms = await Room.find({ userIds: { $all: [userId] } });
    return rooms;
}

const getRecentChat = (chatRoomIds, userId) => {
    return Message.aggregate([
        { $match: { chatRoomId: { $in: chatRoomIds } } },
        {
            $group: {
                _id: '$chatRoomId',
                messageId: { $last: '$_id' },
                chatRoomId: { $last: '$chatRoomId' },
                message: { $last: '$message' },
                type: { $last: '$type' },
                postedByUser: { $last: '$postedByUser' },
                createdAt: { $last: '$createdAt' },
                readByRecipients: { $last: '$readByRecipients' },
            }
        },
        { $sort: { createdAt: -1 } },

        {
            $lookup: {
                from: 'users',
                localField: 'postedByUser',
                foreignField: '_id',
                as: 'postedByUser',
            }
        },

        { $unwind: "$postedByUser" },
        {
            $lookup: {
                from: 'rooms',
                localField: '_id',
                foreignField: '_id',
                as: 'roomInfo',
            }
        },
        { $unwind: "$roomInfo" },
        { $unwind: "$roomInfo.userIds" }
    ])
}

const getChatByRoomId = (chatRoomId) => {
    return Message.aggregate([
        { $match: { chatRoomId } },
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: 'users',
                localField: 'postedByUser',
                foreignField: '_id',
                as: 'postedByUser',
            }
        },
        { $unwind: "$postedByUser" }
    ]);
}

const initiateChat = async (userIds, type, chatInitiator) => {
    const availableRoom = await Room.findOne({
        userIds: {
            $size: userIds.length,
            $all: [...userIds],
        },
        type
    });

    if (availableRoom) {
        return {
            isNew: false,
            message: 'Retrieving an old chat room',
            chatRoomId: availableRoom._id,
            type: availableRoom.type
        }
    }

    const newRoom = await Room.create({
        userIds, type, initiator: chatInitiator
    });

    return {
        isNew: true,
        message: 'Creating a new chat room',
        chatRoomId: newRoom._id,
        type: newRoom.type
    }
}

const createPostInChatRoom = async (chatRoomId, text, postedByUserId) => {
    const post = await Message.create({
        chatRoomId,
        text,
        postedByUserId,
    });
    
    // TODO
    return post;
}


module.exports = {
    getChatRoomsByUserId,
    getRecentChat,
    getChatByRoomId,
    initiateChat,
    createPostInChatRoom
}