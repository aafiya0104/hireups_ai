import { NextRequest, NextResponse } from "next/server";

import { discoverRecruiterCandidates } from "@/lib/recruiterStore";
import type { ApiResponse, CandidateFilters, DiscoverPayload } from "@/lib/recruiter-types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      jobDescription?: string;
      filters?: CandidateFilters;
    };
    const result = await discoverRecruiterCandidates({
      jobDescription: body.jobDescription ?? "",
      filters: body.filters ?? {},
    });

    return NextResponse.json<ApiResponse<DiscoverPayload>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("POST /api/recruiter/discover failed.", error);
    const fallback = await discoverRecruiterCandidates({ jobDescription: "", filters: {} });
    return NextResponse.json<ApiResponse<DiscoverPayload>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
