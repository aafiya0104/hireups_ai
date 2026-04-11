import { NextRequest, NextResponse } from "next/server";

import { getRecruiterCandidates } from "@/lib/recruiterStore";
import type { ApiResponse, CandidateFilters, CandidateRecord } from "@/lib/recruiter-types";

export const dynamic = "force-dynamic";

function parseFilters(request: NextRequest): CandidateFilters {
  const skills = request.nextUrl.searchParams
    .get("skills")
    ?.split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const availability = request.nextUrl.searchParams.get("availability");

  return {
    skills,
    branch: request.nextUrl.searchParams.get("branch") ?? undefined,
    minCgpa: request.nextUrl.searchParams.get("minCgpa")
      ? Number(request.nextUrl.searchParams.get("minCgpa"))
      : undefined,
    minDsaScore: request.nextUrl.searchParams.get("minDsaScore")
      ? Number(request.nextUrl.searchParams.get("minDsaScore"))
      : undefined,
    minPortfolioScore: request.nextUrl.searchParams.get("minPortfolioScore")
      ? Number(request.nextUrl.searchParams.get("minPortfolioScore"))
      : undefined,
    availability:
      availability === null ? undefined : availability === "true" ? true : availability === "false" ? false : undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getRecruiterCandidates(parseFilters(request));
    return NextResponse.json<ApiResponse<CandidateRecord[]>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("GET /api/recruiter/candidates failed.", error);
    const fallback = await getRecruiterCandidates({});
    return NextResponse.json<ApiResponse<CandidateRecord[]>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
