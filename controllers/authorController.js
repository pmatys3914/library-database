const { body, result, validationResult } = require("express-validator");

let async = require("async");
let config = require('../config/databaseConfig');
let con = config.connection;
let moment = require("moment");

// Helper function for rendering the page
let renderAuthors = function (req, res, msg) {
    con.query("SELECT * FROM Authors", function (err, rows, fields) {
        if (err) throw err;
        res.render('authors', { title: 'Authors', items: rows, messages: msg})
    });
}

// Render the plain author page
exports.index = function(req, res) {
    renderAuthors(req, res, {});
}

// Attempt to add a new author to the database and render the page again.
exports.addAuthor = [
    body('name', 'Name must not be empty').trim().isLength({min: 1, max: 256}).escape(),
    body('yearBorn', 'Birth Year must not be empty').trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            let sql = `INSERT INTO Authors (Name, YearBorn) VALUES (?, ?)`;
            con.query(sql, [req.body.name, req.body.yearBorn], function(err, result) {
                if(err) throw err;
                console.log("1 Author added.");
            });
            renderAuthors(req, res, ['Author ' + req.body.name + ' added to the database.']);
        } else
        {
            renderAuthors(req, res, errors.array());
        }
    }
];

// Attempt to remove the author from database by id and render the page again.
exports.removeAuthor = [
    body('removed', 'Invalid Author').isInt(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            let sql = 'DELETE FROM Authors WHERE AuthorID=?';
            con.query(sql, [req.body.removed], function(err, result) {
                if (err) throw err;
                console.log("1 Author removed.");
            });
            renderAuthors(req, res, ['Author ' + req.body.name + ' added to the database.']);
        } else
        {
            renderAuthors(req, res, errors.array());
        }
    }
]