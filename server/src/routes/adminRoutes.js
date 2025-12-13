import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { CuratedPodcast } from "../models/CuratedPodcast.js";
import { CuratedNews } from "../models/CuratedNews.js";
import { CuratedContest } from "../models/CuratedContest.js";

const router = Router();

// All admin routes: auth + adminOnly
router.use(auth, adminOnly);

// PODCASTS
router.get("/podcasts", async (_req, res, next) => {
  try {
    const items = await CuratedPodcast.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
});

router.post("/podcasts", async (req, res, next) => {
  try {
    const { title, platform, url, active, order } = req.body || {};
    const item = await CuratedPodcast.create({
      title,
      platform,
      url,
      active: active !== false,
      order: order || 0,
    });
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
});

// NEWS
router.get("/news", async (_req, res, next) => {
  try {
    const items = await CuratedNews.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
});

router.post("/news", async (req, res, next) => {
  try {
    const { title, url, source, active, order } = req.body || {};
    const item = await CuratedNews.create({
      title,
      url,
      source: source || "IAPSS",
      active: active !== false,
      order: order || 0,
    });
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
});

// CONTESTS
router.get("/contests", async (_req, res, next) => {
  try {
    const items = await CuratedContest.find().sort({
      order: 1,
      startTime: 1,
    });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
});

router.post("/contests", async (req, res, next) => {
  try {
    const { name, site, url, startTime, endTime, active, order } =
      req.body || {};
    const item = await CuratedContest.create({
      name,
      site: site || "IAPSS",
      url,
      startTime,
      endTime,
      active: active !== false,
      order: order || 0,
    });
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
});

export default router;
