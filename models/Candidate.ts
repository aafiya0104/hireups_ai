import { Schema, model, models } from "mongoose";

const CandidateSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    cgpa: { type: Number, required: true, default: 0 },
    skills: { type: [String], default: [] },
    dsaScore: { type: Number, required: true, default: 0 },
    portfolioScore: { type: Number, required: true, default: 0 },
    availability: { type: Boolean, default: true },
    email: { type: String, default: "" },
    graduationYear: { type: Number, default: null },
    headline: { type: String, default: "" },
  },
  { timestamps: true, collection: "candidates" },
);

export const CandidateModel = models.Candidate || model("Candidate", CandidateSchema);
