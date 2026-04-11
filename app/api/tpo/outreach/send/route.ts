import { NextRequest, NextResponse } from "next/server";

import { sendOutreach } from "@/lib/tpoStore";
import type { ApiResponse, OutreachRecord } from "@/lib/tpo-types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { recipient?: string; company?: string };
    const result = await sendOutreach({
      recipient: body.recipient ?? "",
      company: body.company ?? "",
    });

    return NextResponse.json<ApiResponse<OutreachRecord>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("POST /api/tpo/outreach/send failed.", error);
    const fallback = await sendOutreach({ recipient: "", company: "" });
    return NextResponse.json<ApiResponse<OutreachRecord>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
