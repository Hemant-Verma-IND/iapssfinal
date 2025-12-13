import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { ProblemHistory } from "../models/ProblemHistory.js";

const router = Router();

/**
 * GET /api/recommendations/next
 */
router.get("/next", auth, async (req, res, next) => {
  try {
    const agg = await ProblemHistory.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: "$analysis.topic",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          topic: "$_id",
          count: 1,
        },
      },
      { $sort: { count: 1 } }, // fewest first (weak areas)
      { $limit: 3 },
    ]);

    let suggestion;

    if (agg.length === 0) {
      suggestion = {
        focusTopic: "Arrays / Basics",
        reason: "You have not analysed any problems yet. Start from basics.",
        suggestedDifficulty: "Easy",
      };
    } else {
      const weakest = agg[0];
      suggestion = {
        focusTopic: weakest.topic || "Mixed Topics",
        reason: `You have solved only ${weakest.count} problems in this topic compared to others.`,
        suggestedDifficulty: "Medium",
      };
    }

    res.json({
      success: true,
      code: "NEXT_RECOMMENDATION",
      data: suggestion,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
