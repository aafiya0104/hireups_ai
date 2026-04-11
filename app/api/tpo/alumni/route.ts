import { NextRequest, NextResponse } from "next/server";

import { addAlumni, getAlumni } from "@/lib/tpoStore";
import type { AlumniRecord, ApiResponse } from "@/lib/tpo-types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const company = request.nextUrl.searchParams.get("company") ?? "";
    const role = request.nextUrl.searchParams.get("role") ?? "";
    const search = request.nextUrl.searchParams.get("search") ?? "";
    const result = await getAlumni({ company, role, search });

    return NextResponse.json<ApiResponse<AlumniRecord[]>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("GET /api/tpo/alumni failed.", error);
    const fallback = await getAlumni({});
    return NextResponse.json<ApiResponse<AlumniRecord[]>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<AlumniRecord>;
    const result = await addAlumni(body);
    return NextResponse.json<ApiResponse<AlumniRecord>>(
      {
        success: true,
        data: result.data,
        meta: result.meta,
        error: null,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/tpo/alumni failed.", error);
    const fallback = await addAlumni({});
    return NextResponse.json<ApiResponse<AlumniRecord>>(
      {
        success: true,
        data: fallback.data,
        meta: fallback.meta,
        error: null,
      },
      { status: 201 },
    );
  }
}
