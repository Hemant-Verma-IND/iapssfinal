export function errorHandler(err, _req, res, _next) {
  console.error(err);

  const status = err.status || 500;
  const code =
    err.code ||
    (status === 401
      ? "AUTH_ERROR"
      : status === 429
      ? "RATE_LIMIT"
      : status >= 500
      ? "INTERNAL_ERROR"
      : "UNKNOWN_ERROR");

  const message = err.message || "Internal server error";

  res.status(status).json({
    success: false,
    code,
    message,
  });
}
