import { Router } from "express";
import userAuthRouter from "./userAuthRoutes.js";
import { ApiError } from "../utils/ApiError.js";
import commonRouter from "./commonRoutes.js";
import orderRouter from "./orderRouter.js";
import authenticateUser from "../middleware/auth.js";

const router = Router();

router.use("/auth", userAuthRouter);
router.use("/", commonRouter);
router.use("/resto",authenticateUser, orderRouter);

router.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

export default router;
