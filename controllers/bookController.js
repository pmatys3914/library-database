const { body, result, validationResult } = require("express-validator");

let async = require("async");
let config = require('../config/databaseConfig');
let con = config.connection;
let moment = require("moment");

let renderBooks = function (req, res, msg) {
    con.query("SELECT * FROM Books", function (err, rows, fields) {
        if (err) throw err;
        res.render('books', { title: 'Books', items: rows, messages: msg})
    });
}

exports.index = function (req, res) {
    renderBooks(req, res, {});
}

exports.addBook = [
    body('Title', 'Title must not be empty').trim().isLength({ min: 1, max: 32 }).escape(),
    body('Author', 'Author must not be empty').trim().isLength({ min: 1, max: 32 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = `INSERT INTO Books (title, author, date_added) VALUES (?,?,?)`;
            con.query(sql, [req.body.title, req.body.author, moment().format('YYYY-MM-DD HH:mm:ss')], function (err, result) {
                if (err) throw err;
                console.log("1 record added.");
            });
            renderBooks(req, res, ['Book ' + req.body.title + ' added successfully.']);
        } else {
            renderBooks(req, res, errors.array());
        }
    }
];

exports.removeBook = [
    body('removed', 'Invalid book ID').isInt(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            let sql = 'DELETE FROM books WHERE id=?';
            con.query(sql, [req.body.removed], function(err, result) {
                if (err) throw err;
                console.log("1 record removed.");
            });
            renderBooks(req, res, ['Book ID ' + req.body.removed + ' removed successfully']);
        } else {
            renderBooks(req, res, errors.array());
        }
    }
]