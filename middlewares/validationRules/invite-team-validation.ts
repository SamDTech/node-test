const { body } = require("express-validator");
export const inviteTeamValidationRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("email must contain a valid email address"),

    body("firstName")
      .exists({ checkFalsy: true })
      .withMessage("first name cannot be empty"),

    body("lastName")
      .exists({ checkFalsy: true })
      .withMessage("last name must not be empty"),

    body("language")
      .exists({ checkFalsy: true })
      .withMessage("language must not be empty"),

    body("company")
      .exists({ checkFalsy: true })
      .withMessage("company must not be empty"),

    body("role")
      .exists({ checkFalsy: true })
      .withMessage("role must not be empty"),
  ];
};
