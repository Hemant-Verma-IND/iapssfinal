// Simple mock logic to make the UI feel alive.
// Later you can replace these with real API calls to your backend / Gemini.

export function analyseProblemMock(text) {
  const trimmed = text.trim();
  const empty = trimmed.length === 0;

  const baseTopic = trimmed.toLowerCase();

  let topic = "General Problem Solving";
  let subtopics = ["Reading", "Understanding constraints"];
  let difficulty = "Easy";

  if (baseTopic.includes("graph")) {
    topic = "Graphs";
    subtopics = ["BFS / DFS", "Shortest Path"];
    difficulty = "Medium";
  } else if (baseTopic.includes("dp") || baseTopic.includes("dynamic")) {
    topic = "Dynamic Programming";
    subtopics = ["State design", "Transition", "Base cases"];
    difficulty = "Medium–Hard";
  } else if (baseTopic.includes("segment tree")) {
    topic = "Range Queries / Segment Tree";
    subtopics = ["Tree building", "Lazy propagation"];
    difficulty = "Hard";
  }

  const hints = [
    {
      level: 1,
      label: "Level 1 – Direction",
      text: empty
        ? "Write the problem statement to get a high-level direction."
        : "Identify input, output and key constraints. Ask: is this more about searching, counting, or optimising something?",
    },
    {
      level: 2,
      label: "Level 2 – Approach",
      text: empty
        ? "Once you add a problem, this level will describe the main idea without giving code."
        : `Try to map the problem to a known pattern in ${topic}. Think about how to represent the state and transitions, or which traversal/order you need.`,
    },
    {
      level: 3,
      label: "Level 3 – Detailed Plan",
      text: empty
        ? "Detailed steps and edge cases will appear here."
        : "Write down step-wise logic: 1) parse input, 2) build necessary data structures, 3) run your core algorithm, 4) handle edge cases like empty arrays, equal elements, or overflow.",
    },
  ];

  return {
    topic,
    subtopics,
    difficulty,
    hints,
  };
}

export function analyseCodeMock(code, lang) {
  return {
    output:
      `Language detected: ${lang}\n\n` +
      "Issues:\n- Mock: Possible inefficiency at line 12\n- Mock: Variable declared but never used\n\n" +
      "Suggested Fix:\n- Mock: Consider using a hashmap instead\n\n" +
      "Improved Code:\n" +
      "-----------------\n" +
      code.replace(/\t/g, "    "),
  };
}
