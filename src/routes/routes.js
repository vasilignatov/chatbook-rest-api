const httpStatus = require('http-status');
const router = require('express').Router();
const userController = require('./user.route.js');
const authController = require('./auth.route.js');
const chatController = require('./chat.route.js');

const AppError = require('../utils/AppError');
const { auth } = require('../middlewares/auth.js');

router.use((req, res, next) => {
    console.log(req.method, ' -> ', req.url);
    next();
});

router.use('/auth', authController);
router.use('/users', auth, userController);
router.use('/chat', auth, chatController);

router.all('*', (req, res, next) => {
    next(new AppError(httpStatus['404'], httpStatus.NOT_FOUND));
});


module.exports = router;