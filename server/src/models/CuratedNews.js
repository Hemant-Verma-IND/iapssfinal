import mongoose from "mongoose";

const curatedNewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    source: { type: String, default: "IAPSS" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CuratedNews = mongoose.model("CuratedNews", curatedNewsSchema);
