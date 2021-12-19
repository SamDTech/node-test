const { body } = require("express-validator");
export const userValidationRules = () => {
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
        .exists({checkFalsy: true})
        .withMessage("language must not be empty"),
  ];
};
