import { Router } from "express";
import authRoutes from "./auth.routes";
import ordersRoutes from "./orders.routes";
import { getImagesApp, getImagesByFolder } from "../controllers/files.controller";

const router = Router();

router.use("/auth", authRoutes);
router.use("/orders", ordersRoutes);
router.get("/images-app/:filename", getImagesApp);
router.get("/images/:folder/:filename", getImagesByFolder);

export default router;
