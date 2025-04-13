import { Router } from "express";
import API_ENDPOINTS from "./apiEndpoints.js";
import adminController from "../controllers/Admin/AdminController.js";
import { upload } from "../utils/helpers.js";

const adminRouter = Router();

adminRouter.get(API_ENDPOINTS.ORDERS, adminController.getAllOrders);

adminRouter.get(
  API_ENDPOINTS.GET_TABLE_BOOKINGS,
  adminController.getAllTableBookings
);

adminRouter.get(API_ENDPOINTS.USERS, adminController.getAllUsers);
adminRouter.post(API_ENDPOINTS.UPDATE_MENU, adminController.updateMenu);

adminRouter.post(
  API_ENDPOINTS.UPLOAD_IMAGE,
  upload.single("image"),
  adminController.uploadImage
);
export default adminRouter;
