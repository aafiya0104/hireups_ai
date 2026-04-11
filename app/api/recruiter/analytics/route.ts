import { NextResponse } from "next/server";

import { getRecruiterAnalytics } from "@/lib/recruiterStore";
import type { AnalyticsPayload, ApiResponse } from "@/lib/recruiter-types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getRecruiterAnalytics();
    return NextResponse.json<ApiResponse<AnalyticsPayload>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("GET /api/recruiter/analytics failed.", error);
    const fallback = await getRecruiterAnalytics();
    return NextResponse.json<ApiResponse<AnalyticsPayload>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
