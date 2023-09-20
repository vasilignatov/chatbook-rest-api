const Message = require('../models/Message');
const Room = require('../models/Room');

const getChatRoomsByUserId = async (userId) => {
    const rooms = await Room.find({ userIds: { $all: [userId] } });
    return rooms;
}

const getChatRoomByRoomId = async (roomId) => {
    const room = await Room.findById(roomId);
    return room;
}

const getRecentChat = (chatRoomIds, userId) => {

    return Message.aggregate([
        { $match: { chatRoomId: { $in: chatRoomIds } } },
        {
            $group: {
                _id: '$chatRoomId',
                messageId: { $last: '$_id' },
                chatRoomId: { $last: '$chatRoomId' },
                text: { $last: '$text' },
                postedByUserId: { $last: '$postedByUserId' },
                createdAt: { $last: '$createdAt' },
            }
        },
        { $sort: { createdAt: -1 } },

        {
            $lookup: {
                from: 'users',
                localField: 'postedByUserId',
                foreignField: '_id',
                as: 'postedByUserId',
            }
        },

        { $unwind: "$postedByUserId" },
        {
            $lookup: {
                from: 'rooms',
                localField: '_id',
                foreignField: '_id',
                as: 'roomInfo',
            }
        },
        { $unwind: "$roomInfo" },
    ])
}

const getChatByRoomId = (chatRoomId) => {
    return Message
        .find({ chatRoomId })
        .sort({ createdAt: 1 })
        .populate('postedByUserId')
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
    getChatRoomByRoomId,
    getRecentChat,
    getChatByRoomId,
    initiateChat,
    createPostInChatRoom
}