const router = require('express').Router();
const chatController = require('../controllers/chat.controller');

router.get('/', chatController.getRecentChat);
router.get('/:roomId', chatController.getChatByRoomId);
router.post('/initiate', chatController.initiate);

module.exports = router;