const httpStatus = require('http-status');
const ImageKit = require("imagekit");

const Token = require('../models/Token');
const AppError = require('../utils/AppError');
const userService = require('./user.service');
const tokenService = require('./token.service');
const config = require('../config/config')[process.env.NODE_ENV];

const loginLocal = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    const isAuthenticated = await user.validatePassword(password);

    if (!user || !isAuthenticated) {
        throw new AppError('Wrong username or password', httpStatus.UNAUTHORIZED);
    }
    return user;
}

const logout = async (refreshToken) => {
    const token = await Token.findOne({ token: refreshToken, type: 'refresh', blacklisted: false });

    if (!token) {
        throw new AppError(httpStatus[`404_MESSAGE`], httpStatus.NOT_FOUND);
    }

    await token.deleteOne();
}

const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
        const user = await userService.getUserById(refreshTokenDoc.user);

        if (!user) throw new Error();

        await refreshTokenDoc.deleteOne();
        return tokenService.generateAuthTokens(user);
    } catch (err) {
        throw new AppError('Place authenticate', httpStatus.UNAUTHORIZED);
    }
}

const generateImageKitToken = async () => {
    const imagekit = new ImageKit({
        publicKey: config.IMAGE_KIT_PUBLIC_KEY,
        privateKey: config.IMAGE_KIT_PRIVATE_KEY,
        urlEndpoint: config.IMAGE_KIT_ENDPOINT
    });
    const authParams = imagekit.getAuthenticationParameters();
    return authParams;
}

module.exports = {
    loginLocal,
    logout,
    refreshAuth,
    generateImageKitToken
}
