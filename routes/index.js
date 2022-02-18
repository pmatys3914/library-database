let express = require('express');
let router = express.Router();
module.exports = router;

// Controllers
let bookController = require('../controllers/bookController');
let authorController = require('../controllers/authorController');

// Book Page
router.get('/', bookController.index);

// Add Book POST
router.post('/books/add', bookController.addBook);

// Remove Book POST
router.post('/books/remove', bookController.removeBook);

// Edit Book POST
router.post('/books/edit', bookController.editBook);

// Authors Page
router.get('/authors/', authorController.index);

// Add Author POST
router.post('/authors/add', authorController.addAuthor);

// Remove Author POST
router.post('/authors/remove', authorController.removeAuthor);

// Edit Author POST
router.post('/authors/edit', authorController.editAuthor);