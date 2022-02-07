const { body, result, validationResult } = require("express-validator");

let async = require("async");
let config = require('../config/databaseConfig');
let con = config.connection;
let moment = require("moment");

let renderBooks = function (req, res, msg) {
    con.query("SELECT * FROM Books", function (err, rows) {
        if (err) throw err;
        con.query("SELECT * FROM Authors", function(err, authors) {
            if (err) throw err;
            rows.forEach(row => {
                row.AuthorName = authors.find(e => e.AuthorID == row.AuthorID).Name;
            });
            res.render('books', { title: 'Books', items: rows, authors: authors, messages: msg})
        })
    });
}

exports.index = function (req, res) {
    renderBooks(req, res, {});
}

exports.addBook = [
    body('Title', 'Title must not be empty').trim().isLength({ min: 1, max: 32 }).escape(),
    body('Author', 'Author must not be empty').trim().isLength({ min: 1, max: 32 }).escape(),
    body('Year', 'Release Year must not be empty').isLength({ min:1 }).trim(),
    body('Copies', 'Number of copies must not be empty').isLength({ min:1 }).trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = `INSERT INTO Books (Title, AuthorID, Year, Copies, CheckedOut) VALUES (?, ?, ?, ?, 0)`;
            con.query(sql, [req.body.Title, req.body.Author, req.body.Year, req.body.Copies], function (err, result) {
                if (err) throw err;
                console.log("1 record added.");
            });
            renderBooks(req, res, ['Book ' + req.body.Title + ' added successfully.']);
        } else {
            renderBooks(req, res, errors.array());
        }
    }
];

exports.removeBook = [
    body('Removed', 'Invalid book ID').isInt(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            let sql = 'DELETE FROM books WHERE id=?';
            con.query(sql, [req.body.Removed], function(err, result) {
                if (err) throw err;
                console.log("1 record removed.");
            });
            renderBooks(req, res, ['Book ID ' + req.body.Removed + ' removed successfully']);
        } else {
            renderBooks(req, res, errors.array());
        }
    }
]