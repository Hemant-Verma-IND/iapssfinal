import { UserStats } from "../models/UserStats.js";

function formatDate(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * type: "problem" | "code"
 */
export async function updateUserStats(userId, type) {
  const now = new Date();
  const todayKey = formatDate(now);

  let stats = await UserStats.findOne({ user: userId });

  if (!stats) {
    stats = await UserStats.create({
      user: userId,
      totalProblems: 0,
      totalCodeAnalyses: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      perDayCounts: {},
    });
  }

  // update totals
  if (type === "problem") {
    stats.totalProblems += 1;
  } else if (type === "code") {
    stats.totalCodeAnalyses += 1;
  }

  // streak logic
  const lastDate = stats.lastActiveDate
    ? formatDate(stats.lastActiveDate)
    : null;

  if (!lastDate) {
    // first activity
    stats.currentStreak = 1;
    stats.longestStreak = 1;
  } else {
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayKey = formatDate(yesterday);

    if (lastDate === todayKey) {
      // same day → streak unchanged
    } else if (lastDate === yesterdayKey) {
      // continuous streak
      stats.currentStreak += 1;
      if (stats.currentStreak > stats.longestStreak) {
        stats.longestStreak = stats.currentStreak;
      }
    } else {
      // gap → reset streak
      stats.currentStreak = 1;
    }
  }

  stats.lastActiveDate = now;

  // per day counts
  const currentCount = stats.perDayCounts.get(todayKey) || 0;
  stats.perDayCounts.set(todayKey, currentCount + 1);

  await stats.save();
}
