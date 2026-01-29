import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import passport from "passport";


const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";
const SALT_ROUNDS = 10;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

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

// --- HELPER FOR REDIRECT ---
const redirectWithAuth = (res, user, token) => {
  const userData = encodeURIComponent(
    JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  );
  res.redirect(`${CLIENT_ORIGIN}/auth-success?token=${token}&user=${userData}`);
};

// --- GOOGLE ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${CLIENT_ORIGIN}/login` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: "2h" });
    redirectWithAuth(res, req.user, token);
  }
);

// --- GITHUB ---
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: `${CLIENT_ORIGIN}/login`, session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: "2h" });
    redirectWithAuth(res, req.user, token);
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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "2h" });

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
