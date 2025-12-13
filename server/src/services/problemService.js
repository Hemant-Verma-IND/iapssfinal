import { callGemini } from "./geminiClient.js";

export async function analyseProblem(problemText) {
  const prompt = `
You are a competitive programming coach.

Return JSON EXACTLY in this format:
{
  "topic": [],
  "difficulty": "",
  "difficultyScore": 0,
  "summary": "",
  "hints": [],
  "approach": ""
}

Rules:
- hints must be exactly 3 strings
- difficultyScore between 0 and 100
- concise but clear

Problem:
${problemText}
`;

  const raw = await callGemini(prompt);

  try {
    const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    return JSON.parse(json);
  } catch {
    return demoProblemAnalysis();
  }
}

function demoProblemAnalysis() {
  return {
    topic: ["Graph Theory", "BFS"],
    difficulty: "Medium",
    difficultyScore: 65,
    summary: "Grid shortest path with uniform weights.",
    hints: [
      "Model grid as graph with cells as nodes.",
      "All edges have equal cost.",
      "Use BFS from source to target."
    ],
    approach: "Perform BFS using a queue and visited matrix."
  };
}
