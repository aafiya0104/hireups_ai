import { Schema, model, models } from "mongoose";

const CompanySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    roles: { type: [String], default: [] },
    avgSalary: { type: Number, default: 0 },
    hiringFrequency: { type: Number, default: 0 },
    tierMatch: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "companies" },
);

export const CompanyModel = models.Company || model("Company", CompanySchema);
