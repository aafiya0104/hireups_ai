import { NextRequest, NextResponse } from "next/server";

import { getRecruiterInterviews } from "@/lib/recruiterStore";
import type { ApiResponse, InterviewRecord } from "@/lib/recruiter-types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const recruiterId = request.nextUrl.searchParams.get("recruiterId") ?? undefined;
    const result = await getRecruiterInterviews(recruiterId);
    return NextResponse.json<ApiResponse<InterviewRecord[]>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("GET /api/recruiter/interviews failed.", error);
    const fallback = await getRecruiterInterviews();
    return NextResponse.json<ApiResponse<InterviewRecord[]>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
