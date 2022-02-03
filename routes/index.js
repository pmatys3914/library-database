let express = require('express');
let router = express.Router();
module.exports = router;

// Controllers
let bookController = require('../controllers/bookController');

// Book Page
router.get('/', bookController.index);

// Add Book POST
router.post('/book/add', bookController.addBook);

// Remove Book POST
router.post('/book/remove', bookController.removeBook);