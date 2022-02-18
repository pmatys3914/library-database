const { body, validationResult } = require("express-validator");

let config = require("../config/databaseConfig");
let db = config.connection;
let moment = require("moment");
let utils = require("../utils/utils");

// Helper function rendering the page
let renderUsers = function (req, res, msg) {
    db.query("SELECT * FROM Users", function (err, rows) {
        if (err) throw err;
        res.render('users', { title: 'Users', items: rows, messages: msg })
    });
}


// GET index of all users
exports.index = function (req, res) {
    renderUsers(req, res, {});
}

// GET add user page
exports.addUser = function (req, res) {
    res.render('useradd', { title: 'Register a new User' });
}

// GET manage user page, requires its ID
exports.manageUser = function (req, res) {
    db.query("SELECT * FROM Users WHERE UserID = " + req.params.userid, function (err, rows) {
        if (err) throw err;
        // User ID not found
        if (rows.length == 0) {
            res.send('404');
        }
        else {
            res.render('usermanage', { title: 'Manage ' + rows[0].Name, items: rows });
        }
    });
}

// POST validate and add user
exports.addUserPost = [
    utils.nameValidator,
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = `INSERT INTO Users (Name, RegisterDate) VALUES (?, ?)`;
            db.query(sql, [req.body.Name, moment().format("YYYY-MM-DD HH:mm:ss")], function (err) {
                if (err) throw err;
                console.log("1 User registered.");
            });
            renderUsers(req, res, ['User ' + req.body.Name + ' successfully registered.']);
        } else {
            renderUsers(req, res, errors.array());
        }
    }
]

// POST remove user by ID
exports.removeUserPost = [
    utils.userIDValidator,
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = `DELETE FROM Users WHERE UserID = ?`;
            db.query(sql, [req.body.UserID], function (err) {
                if (err) throw err;
                console.log("1 User removed.");
            });
            renderUsers(req, res, ['User successfully removed.']);
        } else {
            renderUsers(req, res, errors.array());
        }
    }
]

// POST validate and edit user by ID
exports.editUserPost = [
    utils.userIDValidator,
    utils.nameValidator,
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = `UPDATE Users SET Name = ? WHERE UserID = ?`;
            db.query(sql, [req.body.Name, req.body.UserID], function (err) {
                if (err) throw err;
                console.log("1 User updated.");
            })
            renderUsers(req, res, ['User successfully updated.']);
        } else {
            renderUsers(req, res, errors.array());
        }
    }
]