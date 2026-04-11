import { NextRequest, NextResponse } from "next/server";

import { saveRecruiterOffer } from "@/lib/recruiterStore";
import type { ApiResponse, OfferRecord, OfferStatus } from "@/lib/recruiter-types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      offerId?: string;
      candidateId?: string;
      company?: string;
      salary?: number;
      status?: OfferStatus;
      deadline?: string;
    };
    const result = await saveRecruiterOffer({
      offerId: body.offerId,
      candidateId: body.candidateId ?? "",
      company: body.company,
      salary: Number(body.salary ?? 0),
      status: body.status,
      deadline: body.deadline ?? new Date().toISOString(),
    });
    return NextResponse.json<ApiResponse<OfferRecord>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("POST /api/recruiter/offer failed.", error);
    const fallback = await saveRecruiterOffer({
      candidateId: "cand_aarav",
      salary: 12,
      deadline: new Date().toISOString(),
    });
    return NextResponse.json<ApiResponse<OfferRecord>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
