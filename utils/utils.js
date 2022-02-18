// Assortment of utilities
const {body} = require("express-validator")
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