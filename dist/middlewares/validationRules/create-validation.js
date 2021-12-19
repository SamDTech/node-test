"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationRules = void 0;
const { body } = require("express-validator");
const userValidationRules = () => {
    return [
        // username must be an email
        body("email")
            .isEmail()
            .withMessage("email must contain a valid email address"),
        // password must be at least 5 chars long
        body("password")
            .isLength({ min: 5 })
            .withMessage("password must be at least 5 characters long"),
        body("language")
            .exists({ checkFalsy: true })
            .withMessage("language must not be empty"),
    ];
};
exports.userValidationRules = userValidationRules;
