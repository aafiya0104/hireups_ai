import { Schema, model, models } from "mongoose";

const OfferSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    candidateId: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["issued", "accepted", "rejected"],
      default: "issued",
    },
    deadline: { type: Date, required: true },
  },
  { timestamps: true, collection: "offers" },
);

export const OfferModel = models.Offer || model("Offer", OfferSchema);
