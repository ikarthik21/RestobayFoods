import { Router } from "express";
import orderController from "../controllers/orderController.js";
import tableController from "../controllers/tableController.js";
import API_ENDPOINTS from "./apiEndpoints.js";
import { validate } from "../middleware/validate.js";
import { tableSchema } from "../middleware/schema.js";
const orderRouter = Router();

orderRouter.post(API_ENDPOINTS.ORDER, orderController.makeOrder);

orderRouter.post(API_ENDPOINTS.VERIFY_PAYMENT, orderController.verifyPayment);

orderRouter.get(API_ENDPOINTS.ORDERS, orderController.getOrders);

orderRouter.post(
  API_ENDPOINTS.CHECK_TABLE_AVAILABILITY,
  validate(tableSchema),
  tableController.checkTableAvailability
);

orderRouter.post(API_ENDPOINTS.TABLE_ORDER, tableController.makeTableOrder);


orderRouter.get(API_ENDPOINTS.GET_TABLE_BOOKINGS, tableController.getTableBookings);
export default orderRouter;
