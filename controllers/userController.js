const { body, result, validationResult } = require("express-validator");

let async = require("async");
let config = require("../config/databaseConfig");
let con = config.connection;
let moment = require("moment");

// Helper function rendering the page
let renderUsers = function(req, res, msg) {
    con.query("SELECT * FROM Users", function (err, rows) {
        if (err) throw err;
        res.render('users', { title: 'Users', items: rows, messages: msg})
    });
}

exports.index = function (req, res) {
    renderUsers(req, res, {});
}

exports.addUser = function(req, res) {
    res.render('useradd', { title: 'Register a new User' });
}

exports.manageUser = function(req, res) {
    con.query("SELECT * FROM Users WHERE UserID = " + req.params.userid, function (err, rows) {
        if (err) throw err;
        res.render('usermanage', { title: 'Manage ' + rows[0].Name, items: rows});
    });
}

exports.addUserPost = [
    body('Name', 'Name must not be empty').trim().isLength({min: 1, max: 256}),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            let sql = `INSERT INTO Users (Name, RegisterDate) VALUES (?, ?)`;
            con.query(sql, [req.body.Name, moment().format("YYYY-MM-DD HH:mm:ss")], function(err) {
                if(err) throw err;
                console.log("1 User registered.");
            });
            renderUsers(req, res, ['User ' + req.body.Name + ' successfully registered.']);
        } else
        {
            renderUsers(req, res, errors.array());
        }
    }
]

exports.removeUserPost = [
    body('Removed', "Invalid user").isInt().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            let sql = `DELETE FROM Users WHERE UserID = ?`;
            con.query(sql, [req.body.Removed], function(err) {
                if(err) throw err;
                console.log("1 User removed.");
            });
            renderUsers(req, res, ['User successfully removed.']);
        } else {
            renderUsers(req, res, errors.array());
        }
    }
]

exports.editUserPost = [
    body('Name', "Name can't be empty.").trim().isLength({ min: 1, max: 256}),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            let sql = `UPDATE Users SET Name = ? WHERE UserID = ?`;
            con.query(sql, [req.body.Name, req.body.UserID], function(err) {
                if(err) throw err;
                console.log("1 User updated.");
            })
            renderUsers(req, res, ['User successfully updated.']);
        } else {
            renderUsers(req, res, errors.array());
        }
    }
]