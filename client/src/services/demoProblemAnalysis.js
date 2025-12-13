export function demoProblemAnalysis() {
  return {
    topic: ["Graph Theory", "BFS"],
    difficulty: "Medium",
    difficultyScore: 65,
    summary:
      "This problem resembles shortest path computation on an unweighted graph.",
    hints: [
      "Model each cell as a node.",
      "All edges have equal cost.",
      "Breadth-First Search gives shortest path.",
    ],
    approach:
      "1. Push start node into queue.\n2. BFS traversal.\n3. Stop when destination reached.",
  };
}
