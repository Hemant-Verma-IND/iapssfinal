import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { auth } from "../middleware/auth.js";
import { CodeHistory } from "../models/CodeHistory.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { updateUserStats } from "../services/userStatsService.js";
import { analyseCode } from "../services/codeService.js";

const router = Router();

// ----------------------------------------------------
// Paths / upload dir
// ----------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// single uploads folder used everywhere
const uploadDir = path.join(__dirname, "..", "..", "uploads");

// ----------------------------------------------------
// Multer config for CODE files
// ----------------------------------------------------

// allowed extensions for code
const ALLOWED_CODE_EXT = new Set([
  ".cpp",
  ".cc",
  ".cxx",
  ".hpp",
  ".h",
  ".py",
  ".go",
  ".java",
  ".txt",
]);

const codeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, base + ext);
  },
});

const codeUpload = multer({
  storage: codeStorage,
  limits: { fileSize: 256 * 1024 }, // 256 KB per file
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_CODE_EXT.has(ext)) {
      return cb(
        new Error("Only C++/Python/Go/Java/text code files are allowed."),
        false
      );
    }
    cb(null, true);
  },
});

// ----------------------------------------------------
// Upload-code endpoint
// ----------------------------------------------------
router.post(
  "/upload-code",
  (req, res, next) => {
    codeUpload.single("code")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          code: "UPLOAD_ERROR",
          message: err.message || "Code upload failed.",
        });
      }
      if (!req.file) {
        return res.status(400).json({
          success: false,
          code: "NO_FILE",
          message: "No code file provided.",
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

// ----------------------------------------------------
// Per-user rate limiter for heavy operations (/save)
// ----------------------------------------------------
const userHeavyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => req.userId || ipKeyGenerator(req, res),
  message: {
    success: false,
    code: "RATE_LIMIT_USER",
    message: "Too many code operations. Try again later.",
  },
});


// ----------------------------------------------------
// Save code history
// ----------------------------------------------------
router.post("/save", auth, userHeavyLimiter, async (req, res, next) => {
  try {
    const { language, codeText, files, aiResult } = req.body || {};

    const allowedLangs = ["cpp", "py", "go", "java"];
    if (!language || !allowedLangs.includes(language)) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Language must be one of cpp, py, go, java.",
      });
    }

    const hasCode =
      codeText && typeof codeText === "string" && codeText.trim().length > 0;
    const hasFiles = Array.isArray(files) && files.length > 0;

    if (!hasCode && !hasFiles) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Provide code text or at least one uploaded file.",
      });
    }

    const entry = await CodeHistory.create({
      user: req.userId,
      language,
      codeText: hasCode ? codeText : "",
      files: hasFiles ? files : [],
      aiResult: aiResult || {},
    });

     updateUserStats(req.userId, "code").catch((e) =>
      console.error("updateUserStats(code) error:", e)
    );
    //(Side-effect is async; we do not block the response.)
    
    res.json({ success: true, entry });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// (If you still have /analyse or other code routes,
//  put them above this export as additional router.post/ get)
// ----------------------------------------------------
// ----------------------------------------------------
// Analyse code (AI / demo fallback)
// ----------------------------------------------------
router.post("/analyse", async (req, res, next) => {
  try {
    console.log("🔥 /code/analyse hit");
    
    // 1. Extract 'code' (not text)
    const { code, language } = req.body || {};

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Code text is required.",
      });
    }

    let result;
    try {
      console.log("🤖 Sending to Gemini...");
      result = await analyseCode(code, language); 
      // 🚨 BUG FIX HERE: 
      // OLD: result = await analyseProblem(text); // 'text' is undefined!
      // NEW: result = await analyseCode(code, language); 
      
      // Since I am forcing errors for Demo Mode anyway:
      // throw new Error("AI disabled (demo mode)"); 

    } catch (err) {
      console.error("❌ Code analysis failed, demo mode:", err.message);

      // ✅ DEMO FALLBACK
      result = {
        alert: "⚠️ AI analysis is currently unavailable. Showing demo analysis.",
        summary: "Demo analysis (AI unavailable)",
        complexity: "O(N log N)", // Example
        space: "O(N)",
        score: 70,
        issues: [
          { type: "Warning", text: "Potential overflow in loop" }, // Updated format to match frontend object structure
          { type: "Notice", text: "Variable naming can be improved" }
        ],
        security: "No unsafe memory operations detected",
        refactor: "// Use long long for sums\nlong long sum = 0;\nfor (auto v : arr) sum += v;",
        // Make sure 'tests' exists because your frontend checks: !Array.isArray(result.tests)
        tests: [], 
        demo: true,
      };
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
