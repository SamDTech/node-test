const { body } = require("express-validator");
export const createWorkspaceValidationRules = () => {
  return [
    body("workspaceName")
      .exists({ checkFalsy: true })
      .withMessage("workspace name must not be empty"),

    body("team").isArray().notEmpty().withMessage("team name cannot be empty"),


    body("company")
      .exists({ checkFalsy: true })
      .withMessage("company must not be empty"),
  ];
};
