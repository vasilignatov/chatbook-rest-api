const httpStatus = require('http-status');
const userService = require('../services/user.service');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    res
        .status(httpStatus.CREATED)
        .json(user);
});

const getUsers = catchAsync(async (req, res) => {
    const users = await userService.getUsers();
    res.json(users);
});

const getUser = catchAsync(async (req, res) => {

    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError('User not found', httpStatus.NOT_FOUND);
    }

    const user = await userService.getUserById(userId);

    if (!user) {
        throw new AppError('User not found', httpStatus.NOT_FOUND);
    }

    res.json({
        firstName: user.firstName,    
        lastName: user.lastName,
        id: user._id,
        imageUrl: user.imageUrl    
    });
});

const getSuggestions = catchAsync(async (req, res) => { 
    const searchStr = req.query.search;
    const suggestions = await userService.getSuggestions(searchStr);
    
    res.json(suggestions);
});

const deleteUser = catchAsync(async (req, res) => {
    const user = await userService.deleteUserById(req.params.userId.toString());
    res.json(user);
});

const updateUser = catchAsync(async (req, res) => {
    const user = await userService
        .updateUserById(req.params.userId, req.body);

    res.json(user);
});

module.exports = {
    getUsers,
    createUser,
    getUser,
    deleteUser,
    updateUser,
    getSuggestions
}