"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidationRules = void 0;
const { body } = require("express-validator");
const createValidationRules = () => {
    return [
        // username must be an email
        body("activation_token")
            .exists({ checkFalsy: true })
            .withMessage("activation_token must not be empty"),
        // password must be at least 5 chars long
        body("firstName")
            .exists({ checkFalsy: true })
            .withMessage("firstName must not be empty"),
        body("lastName")
            .exists({ checkFalsy: true })
            .withMessage("lastName must not be empty"),
        body("job")
            .exists({ checkFalsy: true })
            .withMessage("job must not be empty"),
        body("whatBringsYouHere")
            .exists({ checkFalsy: true })
            .withMessage("whatBringsYouHere must not be empty"),
        body("phone")
            .exists({ checkFalsy: true })
            .withMessage("phone must not be empty"),
        body("company")
            .exists({ checkFalsy: true })
            .withMessage("company must not be empty"),
        body("size")
            .exists({ checkFalsy: true })
            .withMessage("size must not be empty"),
        body("industry")
            .exists({ checkFalsy: true })
            .withMessage("industry must not be empty"),
        body("CRM")
            .exists({ checkFalsy: true })
            .withMessage("CRM must not be empty"),
    ];
};
exports.createValidationRules = createValidationRules;
