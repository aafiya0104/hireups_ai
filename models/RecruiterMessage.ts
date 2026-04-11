import { Schema, model, models } from "mongoose";

const RecruiterMessageSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    senderId: { type: String, required: true, trim: true },
    receiverId: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    timestamp: { type: Date, required: true },
  },
  { timestamps: true, collection: "messages" },
);

export const RecruiterMessageModel =
  models.RecruiterMessage || model("RecruiterMessage", RecruiterMessageSchema);
