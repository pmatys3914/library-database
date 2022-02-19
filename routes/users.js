let express = require('express');
let router = express.Router();
module.exports = router;

// Controller
let userController = require('../controllers/userController');

// Users Index GET
router.get('/', userController.index);

// Add User GET
router.get('/add', userController.addUser);

// Manage User GET
router.get('/:userid', userController.manageUser)

// Add User POST
router.post('/add', userController.addUserPost);

// Remove User POST
router.post('/remove', userController.removeUserPost);

// Edit User POST
router.post('/edit', userController.editUserPost);