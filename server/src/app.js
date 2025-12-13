import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { PORT, CLIENT_ORIGIN } from "./config/env.js";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";


const app = express();
app.use(express.json({ limit: "10mb" }));
// secure HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false, // allow /uploads to be used by frontend on another origin
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

// Request logging
app.use(morgan("dev"));

// Static uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

// -------- RATE LIMITERS --------

// Auth (login/register) – IP based
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,                  // 20 attempts / 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: "RATE_LIMIT_AUTH",
    message: "Too many auth attempts. Try again later."
  },
});

// General API – IP based safety net
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 120,            // 120 requests / min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: "RATE_LIMIT_API",
    message: "Too many requests. Slow down."
  },
});

// File uploads – STRICTER, for image/code upload endpoints
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 30,                  // 30 file uploads / 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: "RATE_LIMIT_UPLOAD",
    message: "Too many file uploads. Try again later."
  },
});

// Apply limiters to paths
app.use("/api/auth", authLimiter);
app.use("/api/problems", apiLimiter);
app.use("/api/code", apiLimiter);
app.use("/api/history", apiLimiter);
app.use("/api/dashboard", apiLimiter);
app.use("/api/landing", apiLimiter);
app.use("/api/recommendations", apiLimiter);
app.use("/api/admin", apiLimiter);



// Extra strict limiter only for upload endpoints
app.use("/api/problems/upload-image", uploadLimiter);
app.use("/api/code/upload-code", uploadLimiter);

// -------- BASE ROUTE --------
app.get("/", (_req, res) => {
  res.json({
    success: true,
    code: "OK",
    service: "IAPSS API",
  });
});

// -------- ROUTES + ERROR HANDLER --------
app.use("/api", router);
app.use(errorHandler);

// -------- START SERVER --------
connectDB();

app.listen(PORT, () => {
  console.log(`IAPSS server running on http://localhost:${PORT}`);
});
