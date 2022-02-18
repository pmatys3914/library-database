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

app.use('/', indexRouter);

// Start listening
app.listen(3000, () => {
    console.log('Listening!');
})
