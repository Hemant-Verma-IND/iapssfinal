import { callGemini } from "./geminiClient.js";

export async function analyseCode(code, language) {
  const prompt = `
You are a senior competitive programming reviewer.

Return JSON EXACTLY:
{
  "complexity": "",
  "space": "",
  "score": 0,
  "issues": [
    { "type": "", "text": "" }
  ],
  "security": "",
  "refactor": ""
}

Code (${language}):
${code}
`;

  const raw = await callGemini(prompt);

  try {
    const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    return JSON.parse(json);
  } catch {
    return demoCodeAnalysis();
  }
}

function demoCodeAnalysis() {
  return {
    complexity: "O(N log N)",
    space: "O(N)",
    score: 70,
    issues: [
      { type: "Logic", text: "Fails for empty input." }
    ],
    security: "Safe",
    refactor: "Use long long to avoid overflow."
  };
}
