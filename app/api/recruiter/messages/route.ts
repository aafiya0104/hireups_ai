import { NextRequest, NextResponse } from "next/server";

import { getRecruiterMessages } from "@/lib/recruiterStore";
import type { ApiResponse, MessageRecord } from "@/lib/recruiter-types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const recruiterId = request.nextUrl.searchParams.get("recruiterId") ?? undefined;
    const candidateId = request.nextUrl.searchParams.get("candidateId") ?? undefined;
    const result = await getRecruiterMessages({ recruiterId, candidateId });
    return NextResponse.json<ApiResponse<MessageRecord[]>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("GET /api/recruiter/messages failed.", error);
    const fallback = await getRecruiterMessages({});
    return NextResponse.json<ApiResponse<MessageRecord[]>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
