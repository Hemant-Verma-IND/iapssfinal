import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "hemudoesntlove";

export function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      code: "AUTH_NO_TOKEN",
      message: "No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      code: "AUTH_INVALID_TOKEN",
      message: "Invalid or expired token.",
    });
  }
}
