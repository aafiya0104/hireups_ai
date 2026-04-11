import { NextResponse } from "next/server";

import { approveOutreach } from "@/lib/tpoStore";
import type { ApiResponse, OutreachRecord } from "@/lib/tpo-types";

export const dynamic = "force-dynamic";

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const result = await approveOutreach(id);
    return NextResponse.json<ApiResponse<OutreachRecord | null>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("PATCH /api/tpo/outreach/[id]/approve failed.", error);
    return NextResponse.json<ApiResponse<OutreachRecord | null>>({
      success: true,
      data: null,
      meta: {
        source: "fallback",
        fallbackUsed: true,
        message: "Outreach approval could not be completed.",
      },
      error: null,
    });
  }
}
