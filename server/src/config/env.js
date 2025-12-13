import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
export const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
