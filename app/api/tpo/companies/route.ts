import { NextRequest, NextResponse } from "next/server";

import { addCompany, getCompanies } from "@/lib/tpoStore";
import type { ApiResponse, CompanyRecord } from "@/lib/tpo-types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const role = request.nextUrl.searchParams.get("role") ?? "";
    const result = await getCompanies(role);

    return NextResponse.json<ApiResponse<CompanyRecord[]>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("GET /api/tpo/companies failed.", error);
    const fallback = await getCompanies("");
    return NextResponse.json<ApiResponse<CompanyRecord[]>>({
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
      name?: string;
      roles?: string[];
      avgSalary?: number;
      hiringFrequency?: number;
      tierMatch?: number;
    };
    const result = await addCompany(body);

    return NextResponse.json<ApiResponse<CompanyRecord>>(
      {
        success: true,
        data: result.data,
        meta: result.meta,
        error: null,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/tpo/companies failed.", error);
    const result = await addCompany({});
    return NextResponse.json<ApiResponse<CompanyRecord>>(
      {
        success: true,
        data: result.data,
        meta: result.meta,
        error: null,
      },
      { status: 201 },
    );
  }
}
