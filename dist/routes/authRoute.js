"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const register_validation_1 = require("./../middlewares/validationRules/register-validation");
const authController_1 = require("./../controllers/authController");
const express_1 = require("express");
const validate_request_schema_1 = require("../middlewares/validate-request-schema");
const create_validation_1 = require("../middlewares/validationRules/create-validation");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const reset_password_validation_1 = require("../middlewares/validationRules/reset-password-validation");
const router = (0, express_1.Router)();
exports.authRouter = router;
router.post("/register", (0, create_validation_1.userValidationRules)(), validate_request_schema_1.validateRequestSchema, authController_1.register);
router.post("/activation", (0, register_validation_1.createValidationRules)(), validate_request_schema_1.validateRequestSchema, authController_1.activateAccount);
router.post("/login", authController_1.login);
router.get("/currentUser", auth_middleware_1.requireSignin, authController_1.currentUser);
router.post("/forgotPassword", authController_1.forgotPassword);
router.post("/resetPassword", (0, reset_password_validation_1.resetValidationRules)(), validate_request_schema_1.validateRequestSchema, authController_1.resetPassword);
router.get("/logout", authController_1.logout);
router.post("/resetPassword", authController_1.resetPassword);
