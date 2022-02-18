const { body, result, validationResult } = require("express-validator");

let async = require("async");
let config = require("../config/databaseConfig");
let con = config.connection;
let moment = require("moment");

// Helper function rendering the page
let renderUsers = function (req, res, msg) {
    con.query("SELECT * FROM Users", function (err, rows) {
        if (err) throw err;
        res.render('users', { title: 'Users', items: rows, messages: msg })
    });
}

// Helper name validator
let nameValidator =
    body('Name')
        .isString()
        .withMessage("Invalid Name.")
        .isLength({ min: 8 })
        .withMessage("Name must be at least 8 characters long.")
        .isLength({ max: 256 })
        .withMessage("Name cannot be more than 256 characters long.")
        // Only letters are allowed in names
        .custom(value => {
            if (!value.match(/^[a-zA-ZĄąĆćĘęŁłŃńÓóŚśŻżŹź -]+$/)) {
                return Promise.reject("Name can only consist of letters.");
            }
            return true;
        })
        .escape();

exports.index = function (req, res) {
    renderUsers(req, res, {});
}

exports.addUser = function (req, res) {
    res.render('useradd', { title: 'Register a new User' });
}

exports.manageUser = function (req, res) {
    con.query("SELECT * FROM Users WHERE UserID = " + req.params.userid, function (err, rows) {
        if (err) throw err;
        res.render('usermanage', { title: 'Manage ' + rows[0].Name, items: rows });
    });
}

exports.addUserPost = [
    nameValidator,
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = `INSERT INTO Users (Name, RegisterDate) VALUES (?, ?)`;
            con.query(sql, [req.body.Name, moment().format("YYYY-MM-DD HH:mm:ss")], function (err) {
                if (err) throw err;
                console.log("1 User registered.");
            });
            renderUsers(req, res, ['User ' + req.body.Name + ' successfully registered.']);
        } else {
            renderUsers(req, res, errors.array());
        }
    }
]

exports.removeUserPost = [
    body('Removed')
        .isInt()
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                let sql = `SELECT * FROM Users WHERE UserID = ?`;
                con.query(sql, value, (err, rows) => {
                    if (err) {
                        reject(new Error(err));
                    }
                    if (rows.length == 0) {
                        reject(new Error(`Invalid User ID.`));
                    }

                    resolve(true)
                });
            })
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = `DELETE FROM Users WHERE UserID = ?`;
            con.query(sql, [req.body.Removed], function (err) {
                if (err) throw err;
                console.log("1 User removed.");
            });
            renderUsers(req, res, ['User successfully removed.']);
        } else {
            renderUsers(req, res, errors.array());
        }
    }
]

exports.editUserPost = [
    nameValidator,
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let sql = `UPDATE Users SET Name = ? WHERE UserID = ?`;
            con.query(sql, [req.body.Name, req.body.UserID], function (err) {
                if (err) throw err;
                console.log("1 User updated.");
            })
            renderUsers(req, res, ['User successfully updated.']);
        } else {
            renderUsers(req, res, errors.array());
        }
    }
]