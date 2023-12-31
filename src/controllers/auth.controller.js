const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');

const register = catchAsync(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const user = await userService.createUser({ email, password, firstName, lastName });
    const tokens = await tokenService.generateAuthTokens(user);

    res
        .status(httpStatus.CREATED)
        .json({
            user: {
                _id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl
            },
            tokens: tokens
        });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const userData = await authService.loginLocal(email, password);
    const tokens = await tokenService.generateAuthTokens(userData);

    res.json({
        user: {
            _id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            imageUrl: userData.imageUrl
        },
        tokens: tokens
    });
});

const logout = catchAsync(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    
    res.json({ logout: true });
});

const refreshTokens = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.json(tokens);
});

module.exports = {
    register,
    login,
    logout,
    refreshTokens,
}