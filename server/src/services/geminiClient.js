import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../config/env.js";

let genAI = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log("Gemini 2.5 Pro initialised");
} else {
  console.warn("⚠ Gemini API key missing – demo mode");
}

export async function callGemini(prompt) {
  if (!genAI) {
    throw new Error("Gemini unavailable");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}
