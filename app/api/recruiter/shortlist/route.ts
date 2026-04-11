import { NextRequest, NextResponse } from "next/server";

import { getRecruiterShortlist, saveRecruiterShortlist } from "@/lib/recruiterStore";
import type { ApiResponse, ShortlistPayload } from "@/lib/recruiter-types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const recruiterId = request.nextUrl.searchParams.get("recruiterId") ?? undefined;
    const result = await getRecruiterShortlist(recruiterId);
    return NextResponse.json<ApiResponse<ShortlistPayload>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("GET /api/recruiter/shortlist failed.", error);
    const fallback = await getRecruiterShortlist();
    return NextResponse.json<ApiResponse<ShortlistPayload>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      recruiterId?: string;
      candidateIds?: string[];
    };
    const result = await saveRecruiterShortlist({
      recruiterId: body.recruiterId,
      candidateIds: body.candidateIds ?? [],
    });
    return NextResponse.json<ApiResponse<ShortlistPayload>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("POST /api/recruiter/shortlist failed.", error);
    const fallback = await getRecruiterShortlist();
    return NextResponse.json<ApiResponse<ShortlistPayload>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
