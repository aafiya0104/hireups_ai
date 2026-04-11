import { Schema, model, models } from "mongoose";

const InterviewSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    candidateId: { type: String, required: true, trim: true },
    recruiterId: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["scheduled", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true, collection: "interviews" },
);

export const InterviewModel = models.Interview || model("Interview", InterviewSchema);
