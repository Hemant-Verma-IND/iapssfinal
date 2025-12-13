import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    totalProblems: { type: Number, default: 0 },
    totalCodeAnalyses: { type: Number, default: 0 },

    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },

    // very simple per-day counts (could be expanded later)
    perDayCounts: {
      type: Map,
      of: Number, // key: "YYYY-MM-DD", value: count
      default: {},
    },
  },
  { timestamps: true }
);

export const UserStats = mongoose.model("UserStats", userStatsSchema);
