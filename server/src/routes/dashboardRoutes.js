import { Router } from "express";
import mongoose from "mongoose";
import { auth } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { CodeHistory } from "../models/CodeHistory.js";
import { ProblemHistory } from "../models/ProblemHistory.js";
import { UserStats } from "../models/UserStats.js";



const router = Router();
const toObjectId = (id) => new mongoose.Types.ObjectId(id);

/**
 * GET /api/dashboard/summary
 * Returns:
 *  - user basic info
 *  - languageStats (from CodeHistory)
 *  - problemStats (from ProblemHistory.analysis)
 *  - recentProblems
 *  - recentCode
 */
router.get("/summary", auth, async (req, res, next) => {
  try {
    const userId = toObjectId(req.userId);

    const userPromise = User.findById(userId).select("name email").lean();

    // language counts from CodeHistory
    const langAggPromise = CodeHistory.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$language",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          language: "$_id",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // difficulty counts from ProblemHistory.analysis.difficulty
    const diffAggPromise = ProblemHistory.aggregate([
      { $match: { user: userId, "analysis.difficulty": { $exists: true } } },
      {
        $group: {
          _id: "$analysis.difficulty",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          difficulty: "$_id",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // topic counts from ProblemHistory.analysis.topic
    const topicAggPromise = ProblemHistory.aggregate([
      { $match: { user: userId, "analysis.topic": { $exists: true } } },
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
      { $sort: { count: -1 } },
      { $limit: 20 }, // top 20 topics
    ]);

    // recent problems (for "Recent AC" style list)
    const recentProblemsPromise = ProblemHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("problemText analysis.topic analysis.difficulty createdAt")
      .lean();

    // recent code analyses
    const recentCodePromise = CodeHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("language aiResult createdAt")
      .lean();

    const [
      user,
      languageStats,
      difficultyStats,
      topicStats,
      recentProblems,
      recentCode,
    ] = await Promise.all([
      userPromise,
      langAggPromise,
      diffAggPromise,
      topicAggPromise,
      recentProblemsPromise,
      recentCodePromise,
    ]);

    const totalProblems = recentProblems.length
      ? await ProblemHistory.countDocuments({ user: userId })
      : 0;

    res.json({
      success: true,
      code: "DASHBOARD_SUMMARY",
      data: {
        user: {
          id: user?._id,
          name: user?.name,
          email: user?.email,
        },
        languageStats,
        problemStats: {
          totalProblems,
          byDifficulty: difficultyStats,
          byTopic: topicStats,
        },
        recentProblems,
        recentCode,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/dashboard/progress
router.get("/progress", auth, async (req, res, next) => {
  try {
    const stats = await UserStats.findOne({ user: req.userId }).lean();

    if (!stats) {
      return res.json({
        success: true,
        code: "DASHBOARD_PROGRESS",
        data: {
          totalProblems: 0,
          totalCodeAnalyses: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null,
          perDayCounts: {},
        },
      });
    }

    res.json({
      success: true,
      code: "DASHBOARD_PROGRESS",
      data: {
        totalProblems: stats.totalProblems,
        totalCodeAnalyses: stats.totalCodeAnalyses,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        lastActiveDate: stats.lastActiveDate,
        perDayCounts: Object.fromEntries(stats.perDayCounts || []),
      },
    });
  } catch (err) {
    next(err);
  }
});


export default router;
