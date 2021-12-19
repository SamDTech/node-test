import { createValidationRules } from "./../middlewares/validationRules/register-validation";
import {
  register,
  activateAccount,
  login,
  currentUser,
  forgotPassword,
  resetPassword,
  logout,
  resendActivation,


} from "./../controllers/authController";
import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validate-request-schema";
import { userValidationRules } from "../middlewares/validationRules/create-validation";
import { requireSignin } from "../middlewares/auth.middleware";
import { resetValidationRules } from "../middlewares/validationRules/reset-password-validation";

const router = Router();

// sign up endpoint
router.post(
  "/register",
  userValidationRules(),
  validateRequestSchema,
  register
);

// activate account endpoint
router.patch(
  "/activation",
  // createValidationRules(),
  // validateRequestSchema,
  activateAccount
);

// resend activation link
router.post("/resendActivation", resendActivation);

// login endpoint
router.post("/login", login);

// get the current Logged in user endpoint
router.get("/currentUser", requireSignin, currentUser);

// forgotPassword endpoint
router.post("/forgotPassword", forgotPassword);

// reset Password endpoint
router.post(
  "/resetPassword",
  resetValidationRules(),
  validateRequestSchema,
  resetPassword
);

// user logout endpoint
router.get("/logout", logout);


// router.get('/encrypt', encrypt)

export { router as authRouter };
