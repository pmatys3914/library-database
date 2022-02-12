let http = require('http');
let url = require('url');
let mysql = require('mysql');
let express = require('express');
let app = express();
app.use(express.static('public'));
let moment = require('moment');

const bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.locals.moment = require('moment');

let indexRouter = require('./routes/index');

app.use('/', indexRouter);

app.listen(3000, () => {
    console.log('Listening!');
    app.set('view engine', 'pug');
})
