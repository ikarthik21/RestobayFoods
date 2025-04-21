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

userAuthRouter.post(API_ENDPOINTS.RESEND_VERIFICATION_MAIL, userAuthController.resendVerificationMail);

export default userAuthRouter;
