import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    service: "IAPSS API",
    status: "OK",
    timestamp: new Date().toISOString(),

    db: {
      connected: mongoose.connection.readyState === 1,
    },

    routes: {
      auth: "/api/auth",
      problems: {
        analyse: "/api/problems/analyse",
        uploadImage: "/api/problems/upload-image",
        save: "/api/problems/save",
      },
      code: {
        analyse: "/api/code/analyse",
        upload: "/api/code/upload-code",
        save: "/api/code/save",
      },
      dashboard: "/api/dashboard",
      history: "/api/history",
      landing: "/api/landing",
    },
  });
});

export default router;
