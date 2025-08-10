import { Router } from "express";
import API_ENDPOINTS from "./apiEndpoints.js";
import userAuthController from "../controllers/userAuthController.js";
import { validate } from "../middleware/validate.js";
import { userSchema } from "../middleware/schema.js";

const userAuthRouter = Router();

userAuthRouter.post(
  API_ENDPOINTS.REGISTER,
  validate(userSchema),
  userAuthController.register
);

userAuthRouter.post(API_ENDPOINTS.LOGIN, userAuthController.login);

userAuthRouter.post(API_ENDPOINTS.VERIFY, userAuthController.verifyEmail);

userAuthRouter.post(
  API_ENDPOINTS.RESEND_VERIFICATION_MAIL,
  userAuthController.resendVerificationMail
);

userAuthRouter.post(
  API_ENDPOINTS.FORGOT_PASSWORD,
  userAuthController.forgotPassword
);

userAuthRouter.post(
  API_ENDPOINTS.VALIDATE_RESET_TOKEN,
  userAuthController.validateResetToken
);

userAuthRouter.post(
  API_ENDPOINTS.RESET_PASSWORD,
  userAuthController.resetPassword
);

export default userAuthRouter;
