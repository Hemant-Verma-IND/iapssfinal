export function demoCodeAnalysis() {
  return {
    complexity: "O(N log N)",
    space: "O(N)",
    score: 70,
    issues: [
      { type: "Critical", text: "Possible integer overflow when summing values." },
      { type: "Style", text: "Use descriptive variable names instead of `x`." },
      { type: "Logic", text: "Edge case: empty input not handled." },
    ],
    security: "Safe. No unsafe memory access detected.",
    refactor:
`// Optimized version
long long sum = 0;
for (int v : arr) {
  sum += v;
}`
  };
}
