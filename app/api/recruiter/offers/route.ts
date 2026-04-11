import { NextResponse } from "next/server";

import { getRecruiterOffers } from "@/lib/recruiterStore";
import type { ApiResponse, OfferRecord } from "@/lib/recruiter-types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getRecruiterOffers();
    return NextResponse.json<ApiResponse<OfferRecord[]>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("GET /api/recruiter/offers failed.", error);
    const fallback = await getRecruiterOffers();
    return NextResponse.json<ApiResponse<OfferRecord[]>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
