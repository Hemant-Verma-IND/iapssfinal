import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import passport from "passport";


const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";
const SALT_ROUNDS = 10;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

function sendValidationError(res, message) {
  return res.status(400).json({
    success: false,
    code: "VALIDATION_ERROR",
    message,
  });
}

// simple email regex is enough here
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || name.trim().length < 2) {
      return sendValidationError(res, "Name must be at least 2 characters.");
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return sendValidationError(res, "Please provide a valid email address.");
    }
    if (!password || password.length < 6) {
      return sendValidationError(
        res,
        "Password must be at least 6 characters long."
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        code: "EMAIL_IN_USE",
        message: "This email is already registered.",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({ name, email, passwordHash });

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // FIX 1: Use 'id' to match standard payload
    const token = jwt.sign(
      { id: req.user._id }, 
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // FIX 2: Direct redirect to Dashboard
    res.redirect(`${CLIENT_ORIGIN}/dashboard?token=${token}`);
  }
);

// 1. Redirect to GitHub
// GET /api/auth/github
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// 2. Callback from GitHub
// GET /api/auth/github/callback
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Generate Token
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userString = encodeURIComponent(JSON.stringify({ 
      name: req.user.name, 
      email: req.user.email 
    }));

    // Redirect to same success page as Google
    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}&user=${userString}`);
  }
);


// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !EMAIL_REGEX.test(email)) {
      return sendValidationError(res, "Valid email is required.");
    }
    if (!password) {
      return sendValidationError(res, "Password is required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({
        success: false,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
