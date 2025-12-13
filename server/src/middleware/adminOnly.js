import { User } from "../models/User.js";

export async function adminOnly(req, res, next) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        code: "AUTH_ERROR",
        message: "Authentication required.",
      });
    }

    const user = await User.findById(req.userId).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        code: "FORBIDDEN",
        message: "Admin access required.",
      });
    }

    next();
  } catch (err) {
    next(err);
  }
}
