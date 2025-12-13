import mongoose from "mongoose";

const curatedPodcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    platform: { type: String, default: "" },
    url: { type: String, required: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CuratedPodcast = mongoose.model(
  "CuratedPodcast",
  curatedPodcastSchema
);
