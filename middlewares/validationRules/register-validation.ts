const { body } = require("express-validator");

export const createValidationRules = () => {
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
  ];
};
