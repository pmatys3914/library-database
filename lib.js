//// Require express and configure it
let express = require('express');
let app = express();

const bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// Set up pug and public folder
app.set('view engine', 'pug');
app.use(express.static('public'));

// Set up local libraries
app.locals.moment = require('moment');

// Configure routers
let indexRouter = require('./routes/index');
let booksRouter = require('./routes/books');
let authorsRouter = require('./routes/authors');
let instancesRouter = require('./routes/instances');
let usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/authors', authorsRouter);
app.use('/books/:BookID/instances', instancesRouter);
app.use('/users', usersRouter);

// Start listening
app.listen(3000, () => {
    console.log('Listening!');
})
