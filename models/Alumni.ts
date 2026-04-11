import { Schema, model, models } from "mongoose";

const AlumniSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    seniority: { type: String, default: "Mid" },
    techStack: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "alumni" },
);

export const AlumniModel = models.Alumni || model("Alumni", AlumniSchema);
