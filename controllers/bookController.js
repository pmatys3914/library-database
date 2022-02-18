const { body, result, validationResult } = require("express-validator");

let async = require("async");
let config = require('../config/databaseConfig');
let db = config.connection;
let moment = require("moment");
let utils = require("../utils/utils")

// Helper function rendering the book index
let renderBooks = function (req, res, msg) {
    db.query("SELECT * FROM Books", function (err, books) {
        if (err) throw err;
        db.query("SELECT * FROM Authors", function (err, authors) {
            if (err) throw err;
            books.forEach(book => {
                book.AuthorName = authors.find(e => e.AuthorID == book.AuthorID).Name;
            });
            books.forEach(book => {
                book.CopiesAvailaible = 0;
                book.CopiesTotal = 0;
                db.query("SELECT * FROM BookInstances WHERE BookID = ?", book.BookID, function (err, result) {
                    if (err) throw err;
                    result.forEach(instance => {
                        if(!instance.CheckedOut) {
                            book.CopiesAvailaible++;
                        }
                        book.CopiesTotal++;
                    })
                })
            })
            res.render('books', { title: 'Books', items: books, authors: authors, messages: msg })
        })
    });
}

// GET index of books
exports.index = function (req, res) {
    renderBooks(req, res, {});
}

// GET Book info
exports.bookInfo = function (req, res) {
    let booksql = "SELECT * FROM Books WHERE BookID = ?";
    db.query(booksql, req.params.bookid, (err, book) => {
        if(err) throw err;
        let instancesql = "SELECT * FROM BookInstances WHERE BookID = ?";
        db.query(instancesql, req.params.bookid, (err, instances) => {
            if(err) throw err;
            let authorssql = "SELECT AuthorID, Name FROM Authors";
            db.query(authorssql, (err, authors) => {
                if(err) throw err;
                res.render("bookmanage", {title: "Manage " + book[0].Title, book: book[0], instances: instances, authors: authors });
            })
        })
    })
}

// POST Validate and add a new book
exports.addBook = [
    body('Title', 'Invalid Title')
        .trim()
        .isLength({ min: 8, max: 256 })
        .withMessage("Book Title must be a sting between 8 and 256 characters.")
        .escape(),
    body('Year', 'Release Year must not be empty')
        .isInt({ max: 2022 })
        .withMessage("Release Year must be an integer no higher than 2022."),
    utils.authorIDValidator,
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = `INSERT INTO Books (Title, AuthorID, Year) VALUES (?, ?, ?)`;
            db.query(sql, [req.body.Title, req.body.AuthorID, req.body.Year], function (err, result) {
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
    utils.bookIDValidator,
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = 'DELETE FROM books WHERE id= ?';
            db.query(sql, [req.body.BookID], function (err, result) {
                if (err) throw err;
                console.log("1 record removed.");
            });
            renderBooks(req, res, ['Book ID ' + req.body.BookID + ' removed successfully']);
        } else {
            renderBooks(req, res, errors.array());
        }
    }
]

exports.editBook = [
    utils.bookIDValidator,
    body('Title', 'Invalid Title')
        .trim()
        .isLength({ min: 8, max: 256 })
        .withMessage("Book Title must be a sting between 8 and 256 characters.")
        .escape(),
    body('Year', 'Release Year must not be empty')
        .isInt({ max: 2022 })
        .withMessage("Release Year must be an integer no higher than 2022."),
    utils.authorIDValidator,
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = `UPDATE Books SET Title= ? AuthorID= ? Year= ? Copies = 1 WHERE BookID= ?`;
            db.query(sql, [req.body.Title, req.body.AuthorID, req.body.Year, req.body.BookID], function (err, result) {
                if (err) throw err;
                console.log("1 book modified.");
            });
            renderBooks(req, res, ['Book ' + req.body.Title + ' updated successfully.']);
        } else {
            renderBooks(req, res, errors.array());
        }
    }
];