let http = require('http');
let url = require('url');
let mysql = require('mysql');
let express = require('express');
let app = express();
let moment = require('moment');

app.get('/', (req, res) => {
    con.query("SELECT * FROM books", function(err, rows, fields) {
        if (err) throw err;
        res.render('site', { title: 'Test', message: 'Test1', items: rows});
    })
})

app.get('/add/', (req, res) => {
    let q = url.parse(req.url, true).query;
    let sql = "INSERT INTO books (title, author, date_added) VALUES ('" + q.title + "', '" + q.author + "', '" + moment().format('YYYY-MM-DD HH:mm:ss') + "')";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record added." + moment().format('YYYY-MM-DD HH:mm:ss'));
    });
    res.redirect('/');
})

app.get('/remove/', (req, res) => {
    let q = url.parse(req.url, true).query;
    let sql = "DELETE FROM books WHERE id=" + q.removed;
    con.query(sql, function(err, result) {
        if(err) throw err;
        console.log("1 record removed.");
    });
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('Listening!');
    app.set('view engine', 'pug');
})

let con = mysql.createConnection({

});

con.connect(function(err) {
    if (err) throw err;
    console.log("Database connection established.");
})