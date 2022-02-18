// Assortment of utilities
const { body } = require("express-validator");
let config = require("../config/databaseConfig");
let db = config.connection;

// Helper name validator. Name has to be a string, 8-256 characters, letters, spaces and dashes only
exports.nameValidator =
    body('Name')
        .isString()
        .withMessage("Invalid Name.")
        .isLength({ min: 8 })
        .withMessage("Name must be at least 8 characters long.")
        .isLength({ max: 256 })
        .withMessage("Name cannot be more than 256 characters long.")
        .custom(value => {
            if (!value.match(/^[a-zA-ZĄąĆćĘęŁłŃńÓóŚśŻżŹź -]+$/)) {
                return Promise.reject("Name can only consist of letters.");
            }
            return true;
        })
        .escape();

// Helpers that check whether an element exists
// User
exports.userIDValidator = 
body("UserID", "Invalid User ID")
.isInt()
.custom((value) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM Users WHERE UserID = ?`;
        db.query(sql, value, (err, rows) => {
            if (err) {
                reject(new Error(err));
            }
            else if (rows.length == 0) {
                reject(new Error("Invalid User ID."));
            }
            resolve(true);
        });
    })
})

// Book
exports.bookIDValidator = 
body("BookID", "Invalid Book ID")
.isInt()
.custom((value) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM Books WHERE BookID = ?`;
        db.query(sql, value, (err, rows) => {
            if (err) {
                reject(new Error(err));
            }
            else if (rows.length == 0) {
                reject(new Error("Invalid Book ID."));
            }
            resolve(true);
        });
    })
})

// Author
exports.authorIDValidator = 
body("AuthorID", "Invalid Author ID")
.isInt()
.custom((value) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM Authors WHERE AuthorID = ?`;
        db.query(sql, value, (err, rows) => {
            if (err) {
                reject(new Error(err));
            }
            else if (rows.length == 0) {
                reject(new Error("Invalid Author ID."));
            }
            resolve(true);
        });
    })
})