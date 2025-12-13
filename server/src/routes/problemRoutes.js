import { Router } from "express";
import { analyseProblem } from "../services/problemService.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { auth } from "../middleware/auth.js";
import { ProblemHistory } from "../models/ProblemHistory.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { updateUserStats } from "../services/userStatsService.js";


const router = Router();

// ---------------- MULTER SETUP ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads folder: server/uploads
const uploadDir = path.join(__dirname, "..", "..", "uploads");


// storage
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, base + ext);
  },
});

// only images, max 2 MB
const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new Error("Only image uploads are allowed (PNG/JPG/etc.)."),
        false
      );
    }
    cb(null, true);
  },
});

// EXISTING PROBLEM ANALYSE ROUTE
router.post("/analyse", async (req, res, next) => {
  try {
    console.log("🔥 /api/problems/analyse hit");
    console.log("BODY:", req.body);

    const { text } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Problem text is required.",
      });
    }

    let result;
    try {
      result = await analyseProblem(text);
    } catch (aiErr) {
      console.error("❌ Gemini failure:", aiErr);

      // 🔁 DEMO FALLBACK
      result = {
        topic: ["Demo"],
        subtopics: [],
        difficulty: "Medium",
        hints: [
          { level: 1, label: "Direction", text: "Think about brute force first." },
          { level: 2, label: "Approach", text: "Optimise using prefix sums or DP." },
          { level: 3, label: "Plan", text: "Iterate once while tracking state." }
        ],
        demo: true,
      };
    }

    res.json(result);
  } catch (err) {
    console.error("❌ Analyse error:", err);
    next(err);
  }
});

// ------------- PUT THIS ROUTE HERE -------------
router.post(
  "/upload-image",
  (req, res, next) => {
    imageUpload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          code: "UPLOAD_ERROR",
          message: err.message || "Image upload failed.",
        });
      }
      if (!req.file) {
        return res.status(400).json({
          success: false,
          code: "NO_FILE",
          message: "No image file provided.",
        });
      }
      next();
    });
  },
  (req, res) => {
    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      file: {
        url: publicUrl,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  }
);

// ------------------------------------------------

const userHeavyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => req.userId || ipKeyGenerator(req, res),
  message: {
    success: false,
    code: "RATE_LIMIT_USER",
    message: "Too many problem operations. Try again later.",
  },
});



// Save analysed problem to history

// ...

router.post("/save", auth, async (req, res, next) => {
  try {
    const { problemText, images, analysis } = req.body || {};

    const hasText = problemText && problemText.trim().length > 0;
    const hasImages =
      Array.isArray(images) && images.length > 0;

    if (!hasText && !hasImages) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Problem text or at least one image is required.",
      });
    }

    const entry = await ProblemHistory.create({
      user: req.userId,
      problemText: hasText ? problemText : "",
      images: hasImages ? images : [],
      analysis: analysis || {},
    });


    updateUserStats(req.userId, "problem").catch((e) =>
  console.error("updateUserStats(problem) error:", e)
  );


    res.json({ success: true, entry });
  } catch (err) {
    next(err);
  }
});




export default router;
