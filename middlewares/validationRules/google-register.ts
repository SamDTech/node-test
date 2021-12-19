const { body } = require("express-validator");

export const googleRegisterValidationRules = () => {
  return [
    // username must be an email
    body("tokenId")
      .exists({ checkFalsy: true })
      .withMessage("tokenId must not be empty"),
    // password must be at least 5 chars long
    body("firstName")
      .exists({ checkFalsy: true })
      .withMessage("firstName must not be empty"),

    body("lastName")
      .exists({ checkFalsy: true })
      .withMessage("lastName must not be empty"),


    body("language")
      .exists({ checkFalsy: true })
      .withMessage("CRM must not be empty"),
  ];
};
