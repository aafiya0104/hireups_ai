import { Schema, model, models } from "mongoose";

const RecruiterShortlistSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    recruiterId: { type: String, required: true, trim: true },
    candidateIds: { type: [String], default: [] },
    createdAt: { type: Date, required: true },
  },
  { timestamps: true, collection: "recruiter_shortlists" },
);

export const RecruiterShortlistModel =
  models.RecruiterShortlist || model("RecruiterShortlist", RecruiterShortlistSchema);
