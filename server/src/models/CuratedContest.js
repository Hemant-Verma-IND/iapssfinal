import mongoose from "mongoose";

const curatedContestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    site: { type: String, default: "IAPSS" },
    url: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CuratedContest = mongoose.model(
  "CuratedContest",
  curatedContestSchema
);
