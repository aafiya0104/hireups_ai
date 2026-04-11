import { Schema, model, models } from "mongoose";

const OutreachSchema = new Schema(
  {
    recipientName: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["sent", "delivered", "replied"],
      default: "sent",
    },
    createdAt: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "outreach" },
);

export const OutreachModel = models.Outreach || model("Outreach", OutreachSchema);
