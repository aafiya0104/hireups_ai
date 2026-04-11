import { Schema, model, models } from "mongoose";

const DriveSchema = new Schema(
  {
    year: { type: Number, required: true },
    companies: { type: Number, default: 0 },
    roles: { type: Number, default: 0 },
    salary: { type: Number, default: 0 },
    selectionRate: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "drives" },
);

export const DriveModel = models.Drive || model("Drive", DriveSchema);
