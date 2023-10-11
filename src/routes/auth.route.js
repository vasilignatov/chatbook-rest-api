const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);
router.post('/refresh-tokens', authController.refreshTokens);

module.exports = router;