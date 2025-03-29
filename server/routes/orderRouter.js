import { Router } from "express";
import orderController from "../controllers/orderController.js";
import API_ENDPOINTS from "./apiEndpoints.js";

const orderRouter = Router();

orderRouter.post(API_ENDPOINTS.ORDER, orderController.makeOrder);

orderRouter.post(API_ENDPOINTS.VERIFY_PAYMENT, orderController.verifyPayment);

orderRouter.get(API_ENDPOINTS.ORDERS, orderController.getOrders);

export default orderRouter;
