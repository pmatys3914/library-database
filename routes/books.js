let express = require('express');
let router = express.Router();
module.exports = router;

// Controller
let bookController = require('../controllers/bookController');

// Book Index GET
router.get('/', bookController.index);

// Book Page GET
router.get('/:bookid', bookController.bookInfo);

// Add Book POST
router.get('/add', bookController.addBook);

// Remove Book POST
router.get('/remove', bookController.removeBook);

// Edit Book POST
router.get('/edit', bookController.editBook);