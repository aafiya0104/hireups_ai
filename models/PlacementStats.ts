import { Schema, model, models } from "mongoose";

const PlacementStatsSchema = new Schema(
  {
    totalOffers: { type: Number, default: 0 },
    avgCTC: { type: Number, default: 0 },
    placementRate: { type: Number, default: 0 },
    unplaced: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "placement_stats" },
);

export const PlacementStatsModel =
  models.PlacementStats || model("PlacementStats", PlacementStatsSchema);
