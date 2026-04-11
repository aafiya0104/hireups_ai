import { NextResponse } from "next/server";

import { getOutreach } from "@/lib/tpoStore";
import type { ApiResponse, OutreachRecord } from "@/lib/tpo-types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getOutreach();
    return NextResponse.json<ApiResponse<OutreachRecord[]>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("GET /api/tpo/outreach failed.", error);
    const fallback = await getOutreach();
    return NextResponse.json<ApiResponse<OutreachRecord[]>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
