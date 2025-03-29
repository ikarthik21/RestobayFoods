import { Router } from "express";
import API_ENDPOINTS from "./apiEndpoints.js";
import cartController from "../controllers/cartController.js";
import menuController from "../controllers/menuController.js";
import authenticateUser from "../middleware/auth.js";

const commonRouter = Router();

commonRouter.get(API_ENDPOINTS.MENU, menuController.getMenu);

commonRouter.post(API_ENDPOINTS.CART, authenticateUser, (req, res) => {
  const { action } = req.body;
  if (action === "add") {
    cartController.addToCart(req, res);
  } else if (action === "remove") {
    cartController.removeFromCart(req, res);
  }
});

commonRouter.get(API_ENDPOINTS.CART, authenticateUser, cartController.getCart);

export default commonRouter;
