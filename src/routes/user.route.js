const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { auth, isAdmin, isOwn } = require('../middlewares/auth');

// only admin can acess these routes
router.get('/', isAdmin, userController.getUsers);
router.post('/', isAdmin, userController.createUser);

// every user can get other users data (excluding the password and email)
router.get('/:userId', userController.getUser);

// Only you can delete and update your own user profile
router.put('/:userId', isOwn, userController.updateUser);
router.delete('/:userId', isOwn, userController.deleteUser);


module.exports = router;

