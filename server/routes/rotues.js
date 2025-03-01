import { Router } from "express";
import userAuthRouter from "./userAuthRoutes.js";
import { ApiError } from "../utils/ApiError.js";
import commonRouter from "./commonRoutes.js";

const router = Router();

router.use("/auth", userAuthRouter);
router.use("/", commonRouter);

router.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

export default router;
