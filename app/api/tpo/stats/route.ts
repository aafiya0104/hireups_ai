import { NextResponse } from "next/server";

import { getPlacementStats } from "@/lib/tpoStore";
import type { ApiResponse, PlacementStatsRecord } from "@/lib/tpo-types";

export const dynamic = "force-dynamic";

type StatsPayload = {
  summary: PlacementStatsRecord;
  charts: Array<{ year: number; avgCTC: number; companies: number; selectionRate: number }>;
};

export async function GET() {
  try {
    const result = await getPlacementStats();
    return NextResponse.json<ApiResponse<StatsPayload>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("GET /api/tpo/stats failed.", error);
    const fallback = await getPlacementStats();
    return NextResponse.json<ApiResponse<StatsPayload>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
