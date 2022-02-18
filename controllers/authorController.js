const { body, validationResult } = require("express-validator");

let async = require("async");
let config = require('../config/databaseConfig');
let db = config.connection;
let moment = require("moment");
let utils = require("../utils/utils")

// Helper function for rendering the page
let renderAuthors = function (req, res, msg) {
    db.query("SELECT * FROM Authors", function (err, rows, fields) {
        if (err) throw err;
        res.render('authors', { title: 'Authors', items: rows, messages: msg })
    });
}

// GET index of all authors
exports.index = function (req, res) {
    renderAuthors(req, res, {});
}

// POST validate and add author
exports.addAuthor = [
    utils.nameValidator,
    body('YearBorn', 'Birth Year must not be empty')
        .isInt({ max: 2022 })
        .withMessage("Year needs to be an integer smaller than 2023.")
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = `INSERT INTO Authors (Name, YearBorn) VALUES (?, ?)`;
            db.query(sql, [req.body.Name, req.body.YearBorn], function (err, result) {
                if (err) throw err;
                console.log("1 Author added.");
            });
            renderAuthors(req, res, ['Author ' + req.body.Name + ' added to the database.']);
        } else {
            renderAuthors(req, res, errors.array());
        }
    }
];

// POST remove author by id
exports.removeAuthor = [
    utils.authorIDValidator,
    body('AuthorID', 'Invalid Author ID')
        .custom((value) => {
            return new Promise((resolve, reject) => {
                let sql = `SELECT BookID, Title FROM Books WHERE AuthorID = ?`;
                db.query(sql, value, (err, rows) => {
                    if (err) {
                        reject(new Error(err));
                    }
                    if (rows.length != 0) {
                        reject(new Error(`Can't remove an author who still has books in the database.`));
                    }
                    resolve(true);
                });
            })
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = 'DELETE FROM Authors WHERE AuthorID = ?';
            db.query(sql, [req.body.AuthorID], function (err, result) {
                if (err) throw err;
                console.log("1 Author removed.");
            });
            renderAuthors(req, res, ['Author removed from the database.']);
        } else {
            renderAuthors(req, res, errors.array());
        }
    }
]

// POST validate and edit author
exports.editAuthor = [
    utils.authorIDValidator,
    utils.nameValidator,
    body('YearBorn', 'Birth Year must not be empty').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = 'UPDATE Authors SET Name= ?, YearBorn= ? WHERE AuthorID= ?';
            db.query(sql, [req.body.Name, req.body.YearBorn, req.body.AuthorID], function (err, result) {
                if (err) throw err;
                console.log("1 Author updated.");
            });
            renderAuthors(req, res, ['Author ' + req.body.Name + ' updated.']);
        } else {
            renderAuthors(req, res, errors.array());
        }
    }
]