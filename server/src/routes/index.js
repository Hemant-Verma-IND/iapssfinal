import { Router } from "express";
import problemRoutes from "./problemRoutes.js";
import codeRoutes from "./codeRoutes.js";
import authRoutes from "./authRoutes.js";
import historyRoutes from "./historyRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import landingRoutes from "./landingRoutes.js";
import recommendationRoutes from "./recommendationRoutes.js";
import adminRoutes from "./adminRoutes.js";
import healthRoutes from "./healthRoutes.js";


const router = Router();

router.use("/auth", authRoutes);
router.use("/problems", problemRoutes);    
router.use("/code", codeRoutes);
router.use("/history", historyRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/landing", landingRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/admin", adminRoutes);
router.use("/health", healthRoutes);


export default router;
