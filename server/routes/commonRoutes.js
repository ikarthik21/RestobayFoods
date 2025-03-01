import { Router } from "express";
import API_ENDPOINTS from "./apiEndpoints.js";
import menuController from "../controllers/menuController.js";

const commonRouter = Router();

commonRouter.get(API_ENDPOINTS.MENU, menuController.getMenu);

export default commonRouter;
