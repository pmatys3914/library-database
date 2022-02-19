let express = require('express');
let router = express.Router();
module.exports = router;

// Controller
let authorController = require('../controllers/authorController');

// Authors Index GET
router.get('/', authorController.index);

// Add Author POST
router.post('/add', authorController.addAuthor);

// Remove Author POST
router.post('/remove', authorController.removeAuthor);

// Edit Author POST
router.post('/edit', authorController.editAuthor);