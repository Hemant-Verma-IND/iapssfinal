import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { CodeHistory } from "../models/CodeHistory.js";
import { ProblemHistory } from "../models/ProblemHistory.js";

const router = Router();

/**
 * Helper to parse pagination params
 */
function getPaging(query) {
  let page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || 10;

  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > 100) limit = 100; // hard cap

  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * CODE HISTORY
 * -------------
 * /api/history         (alias)
 * /api/history/code
 */

/**
 * GET /api/history
 * GET /api/history/code
 * Query params:
 *   page   (default 1)
 *   limit  (default 10, max 100)
 *   language (cpp, py, go, java) optional filter
 *   q       (search in codeText)
 */
router.get(["/", "/code"], auth, async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaging(req.query);

    const filter = { user: req.userId };

    // optional language filter
    if (req.query.language) {
      filter.language = req.query.language;
    }

    // optional text search in codeText
    if (req.query.q) {
      filter.codeText = { $regex: req.query.q, $options: "i" };
    }

    const [items, total] = await Promise.all([
      CodeHistory.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CodeHistory.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      success: true,
      type: "code",
      history: items,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/history/code/:id
 */
router.get("/code/:id", auth, async (req, res, next) => {
  try {
    const item = await CodeHistory.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!item) return res.status(404).json({ error: "Not found" });

    res.json({ success: true, history: item });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/history/code/:id
 */
router.delete("/code/:id", auth, async (req, res, next) => {
  try {
    const deleted = await CodeHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/history/code
 * Clear all code history for this user
 */
router.delete("/code", auth, async (req, res, next) => {
  try {
    await CodeHistory.deleteMany({ user: req.userId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

/**
 * PROBLEM HISTORY
 * ----------------
 * /api/history/problems
 */

/**
 * GET /api/history/problems
 * Query params:
 *   page   (default 1)
 *   limit  (default 10)
 *   topic  (partial match on analysis.topic)
 *   q      (search in problemText)
 */
router.get("/problems", auth, async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaging(req.query);

    const filter = { user: req.userId };

    if (req.query.q) {
      filter.problemText = { $regex: req.query.q, $options: "i" };
    }

    if (req.query.topic) {
      filter["analysis.topic"] = { $regex: req.query.topic, $options: "i" };
    }

    if (req.query.favorite === "true") {
    filter.isFavorite = true;
    }

    if (req.query.tag) {
        filter.tags = req.query.tag;
    }   


    const [items, total] = await Promise.all([
      ProblemHistory.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ProblemHistory.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      success: true,
      type: "problems",
      history: items,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/history/problems/:id
 */
router.get("/problems/:id", auth, async (req, res, next) => {
  try {
    const item = await ProblemHistory.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!item) return res.status(404).json({ error: "Not found" });

    res.json({ success: true, history: item });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/history/problems/:id
 */
router.delete("/problems/:id", auth, async (req, res, next) => {
  try {
    const deleted = await ProblemHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/history/problems
 */
router.delete("/problems", auth, async (req, res, next) => {
  try {
    await ProblemHistory.deleteMany({ user: req.userId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});


// PATCH /api/history/code/:id/favorite
router.patch("/code/:id/favorite", auth, async (req, res, next) => {
  try {
    const { isFavorite } = req.body || {};
    const updated = await CodeHistory.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { isFavorite: !!isFavorite } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        code: "NOT_FOUND",
        message: "History item not found.",
      });
    }

    res.json({ success: true, history: updated });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/history/problems/:id/favorite
router.patch("/problems/:id/favorite", auth, async (req, res, next) => {
  try {
    const { isFavorite } = req.body || {};
    const updated = await ProblemHistory.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { isFavorite: !!isFavorite } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        code: "NOT_FOUND",
        message: "Problem history item not found.",
      });
    }

    res.json({ success: true, history: updated });
  } catch (err) {
    next(err);
  }
});


// PATCH /api/history/code/:id/tags
router.patch("/code/:id/tags", auth, async (req, res, next) => {
  try {
    const { tags } = req.body || {};
    const cleanTags = Array.isArray(tags)
      ? tags
          .map((t) => String(t).trim())
          .filter((t) => t.length > 0)
      : [];

    const updated = await CodeHistory.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { tags: cleanTags } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        code: "NOT_FOUND",
        message: "History item not found.",
      });
    }

    res.json({ success: true, history: updated });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/history/problems/:id/tags
router.patch("/problems/:id/tags", auth, async (req, res, next) => {
  try {
    const { tags } = req.body || {};
    const cleanTags = Array.isArray(tags)
      ? tags
          .map((t) => String(t).trim())
          .filter((t) => t.length > 0)
      : [];

    const updated = await ProblemHistory.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { tags: cleanTags } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        code: "NOT_FOUND",
        message: "Problem history item not found.",
      });
    }

    res.json({ success: true, history: updated });
  } catch (err) {
    next(err);
  }
});


// POST /api/history/code/:id/feedback
router.post("/code/:id/feedback", auth, async (req, res, next) => {
  try {
    const { rating, comment } = req.body || {};
    const r = Number(rating);
    if (!r || r < 1 || r > 5) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Rating must be between 1 and 5.",
      });
    }

    const updated = await CodeHistory.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { feedback: { rating: r, comment: comment || "" } } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        code: "NOT_FOUND",
        message: "History item not found.",
      });
    }

    res.json({ success: true, history: updated });
  } catch (err) {
    next(err);
  }
});

// POST /api/history/problems/:id/feedback
router.post("/problems/:id/feedback", auth, async (req, res, next) => {
  try {
    const { rating, comment } = req.body || {};
    const r = Number(rating);
    if (!r || r < 1 || r > 5) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Rating must be between 1 and 5.",
      });
    }

    const updated = await ProblemHistory.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { feedback: { rating: r, comment: comment || "" } } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        code: "NOT_FOUND",
        message: "Problem history item not found.",
      });
    }

    res.json({ success: true, history: updated });
  } catch (err) {
    next(err);
  }
});



export default router;
