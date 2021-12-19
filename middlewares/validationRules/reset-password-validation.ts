const { body } = require("express-validator");
export const resetValidationRules = () => {
  return [
    // newPassword must be an email
    body("passwordConfirm")
      .isLength({ min: 5 })
      .withMessage("password must be at least 5 characters long"),
    // password must be at least 5 chars long
    body("newPassword")
      .isLength({ min: 5 })
      .withMessage("password must be at least 5 characters long"),

    body("token")
      .exists({ checkFalsy: true })
      .withMessage("token must not be empty"),
  ];
};
