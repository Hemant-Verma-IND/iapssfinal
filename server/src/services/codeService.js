import { callGemini } from "./geminiClient.js";

export async function analyseCode(code, language) {
  // 1. Updating Prompt to match Frontend requirements EXACTLY
  const prompt = `
You are a senior competitive programming reviewer.

Analyze this ${language} code.
Return a RAW JSON object with NO Markdown formatting (no \`\`\`json).

The JSON must strictly follow this schema:
{
  "summary": "Brief explanation of what the code does",
  "complexity": "Time complexity (e.g. O(N))",
  "space": "Space complexity (e.g. O(1))",
  "score": 85,
  "issues": [
    { "type": "Bug/Optimization/Style", "text": "Short description" }
  ],
  "refactor": "The optimized version of the code",
  "tests": ["Edge case 1", "Edge case 2"]
}

Code:
${code}
`;

  try {
    const raw = await callGemini(prompt);

    // 2. Clean the output (Gemini often adds ```json ... ```)
    const cleanRaw = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // 3. Extract JSON safely
    const jsonStartIndex = cleanRaw.indexOf("{");
    const jsonEndIndex = cleanRaw.lastIndexOf("}");
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("No JSON found in AI response");
    }

    const jsonString = cleanRaw.slice(jsonStartIndex, jsonEndIndex + 1);
    
    return JSON.parse(jsonString);

  } catch (err) {
    console.error("AI Parse Error:", err);
    return demoCodeAnalysis(); // Fallback on error
  }
}

// Ensure your fallback matches the frontend structure too
function demoCodeAnalysis() {
  return {
    summary: "Analysis failed. Showing demo data.",
    complexity: "O(N)",
    space: "O(1)",
    score: 50,
    issues: [
      { type: "Error", text: "AI service could not process the request." }
    ],
    refactor: "// No refactor available",
    tests: []
  };
}