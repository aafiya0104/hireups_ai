import { NextRequest, NextResponse } from "next/server";

import { updateCompany } from "@/lib/tpoStore";
import type { ApiResponse, CompanyRecord } from "@/lib/tpo-types";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const result = await updateCompany(id, body);

    return NextResponse.json<ApiResponse<CompanyRecord | null>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("PUT /api/tpo/companies/[id] failed.", error);
    return NextResponse.json<ApiResponse<CompanyRecord | null>>({
      success: true,
      data: null,
      meta: {
        source: "fallback",
        fallbackUsed: true,
        message: "Company update could not be completed.",
      },
      error: null,
    });
  }
}
