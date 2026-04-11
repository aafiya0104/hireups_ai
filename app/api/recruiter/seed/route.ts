import { NextResponse } from "next/server";

import { seedRecruiterDemoData } from "@/lib/recruiterStore";
import type { ApiResponse } from "@/lib/recruiter-types";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const result = await seedRecruiterDemoData();
    return NextResponse.json<ApiResponse<{ seeded: boolean; collections: string[] }>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("POST /api/recruiter/seed failed.", error);
    const fallback = await seedRecruiterDemoData();
    return NextResponse.json<ApiResponse<{ seeded: boolean; collections: string[] }>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
