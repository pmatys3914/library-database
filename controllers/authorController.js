const { body, validationResult } = require("express-validator");

let async = require("async");
let config = require('../config/databaseConfig');
let con = config.connection;
let moment = require("moment");
let utils = require("../utils/utils")

// Helper function for rendering the page
let renderAuthors = function (req, res, msg) {
    con.query("SELECT * FROM Authors", function (err, rows, fields) {
        if (err) throw err;
        res.render('authors', { title: 'Authors', items: rows, messages: msg})
    });
}

// GET index of all authors
exports.index = function(req, res) {
    renderAuthors(req, res, {});
}

// POST validate and add author
exports.addAuthor = [
    utils.nameValidator,
    body('YearBorn', 'Birth Year must not be empty').trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            let sql = `INSERT INTO Authors (Name, YearBorn) VALUES (?, ?)`;
            con.query(sql, [req.body.Name, req.body.YearBorn], function(err, result) {
                if(err) throw err;
                console.log("1 Author added.");
            });
            renderAuthors(req, res, ['Author ' + req.body.Name + ' added to the database.']);
        } else
        {
            renderAuthors(req, res, errors.array());
        }
    }
];

// POST remove author by id
exports.removeAuthor = [
    body('Removed', 'Invalid Author').isInt(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            let sql = 'DELETE FROM Authors WHERE AuthorID = ?';
            con.query(sql, [req.body.Removed], function(err, result) {
                if (err) throw err;
                console.log("1 Author removed.");
            });
            renderAuthors(req, res, ['Author removed from the database.']);
        } else
        {
            renderAuthors(req, res, errors.array());
        }
    }
]

// POST validate and edit author
exports.editAuthor = [
    body('AuthorID', 'Invalid Author').isInt(),
    utils.nameValidator,
    body('YearBorn', 'Birth Year must not be empty').trim().isLength({ min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            let sql = 'UPDATE Authors SET Name= ?, YearBorn= ? WHERE AuthorID= ?';
            con.query(sql, [req.body.Name, req.body.YearBorn, req.body.AuthorID], function(err, result) {
                if (err) throw err;
                console.log("1 Author updated.");
            });
            renderAuthors(req, res, ['Author ' + req.body.Name + ' updated.']);
        } else
        {
            renderAuthors(req, res, errors.array());
        }
    }
]