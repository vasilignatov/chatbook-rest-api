const ImageKit = require("imagekit");
const httpStatus = require('http-status');

const User = require('../models/User');
const AppError = require('../utils/AppError');
const config = require('../config/config')[process.env.NODE_ENV];


const getUsers = async () => {
    return User.find({});
}

const getUserById = async (id) => {
    return User.findById(id);
}

const getUserByEmail = async (email) => {
    return User.findOne({ email });
}

const createUser = async (userData) => {
    if (await User.isEmailTaken(userData.email)) {
        throw new AppError('Email already taken!', httpStatus.BAD_REQUEST);
    }
    return User.create(userData);
}

const updateUserById = async (id, userData) => {
    const user = await getUserById(id);

    if (!user) throw new AppError('User not fount', httpStatus.NOT_FOUND);
    console.log(userData);

    if (userData.imageUrl) {
        const imagekit = new ImageKit({
            publicKey: config.IMAGE_KIT_PUBLIC_KEY,
            privateKey: config.IMAGE_KIT_PRIVATE_KEY,
            urlEndpoint: config.IMAGE_KIT_ENDPOINT
        });

        imagekit.upload({
            file: userData.imageUrl,
            fileName: userData.imageName
        }, (err, result) => {
            if(err) return console.error(err);
            userData.imageUrl = result.url;
        });
    } else {
        delete userData.imageName;
    }
    
    Object.assign(user, userData);
    await user.save();
    return user;
}

const deleteUserById = async (id) => {
    return await User.findByIdAndDelete(id);
}

const getUsersByIds = async (ids) => {
    const users = await User.find({ _id: { $in: ids } });
    return users;
}

const getSuggestions = async (string) => {
    const regex = new RegExp(string, "i");

    return User.aggregate()
        .project({ fullName: { $concat: ['$firstName', ' ', '$lastName'] } })
        .match({ fullName: regex });
}

module.exports = {
    getUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUserById,
    deleteUserById,
    getUsersByIds,
    getSuggestions
}