import mongoose from "mongoose";

const codeHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    language: { type: String, required: true },
    codeText: { type: String, default: "" },

    files: [
      {
        name: String,
        url: String,
        size: Number,
      },
    ],

    aiResult: { type: Object, default: {} },

    // NEW: favourites + tags + feedback
    isFavorite: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
    },
  },
  { timestamps: true }
);

export const CodeHistory = mongoose.model("CodeHistory", codeHistorySchema);
