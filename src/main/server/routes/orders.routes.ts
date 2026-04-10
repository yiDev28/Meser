import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createOrderController } from "../controllers/orders.controller";

const router = Router();

router.post("/", authMiddleware, createOrderController);
//router.get("/", authMiddleware, listOrdersController);

export default router;
