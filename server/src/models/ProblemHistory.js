import mongoose from "mongoose";

const problemHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problemText: { type: String, default: "" },

    images: [
      {
        url: String,
        originalName: String,
        mimeType: String,
        size: Number,
      },
    ],

    analysis: { type: Object, default: {} },

    // NEW
    isFavorite: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
    },
  },
  { timestamps: true }
);

export const ProblemHistory = mongoose.model(
  "ProblemHistory",
  problemHistorySchema
);
