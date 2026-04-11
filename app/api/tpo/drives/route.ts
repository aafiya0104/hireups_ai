import { NextRequest, NextResponse } from "next/server";

import { buildDrivesCsv, getDrives } from "@/lib/tpoStore";
import type { ApiResponse, DriveRecord } from "@/lib/tpo-types";

export const dynamic = "force-dynamic";

type DrivesPayload = {
  drives: DriveRecord[];
  comparison: DriveRecord[];
};

export async function GET(request: NextRequest) {
  try {
    const year = Number(request.nextUrl.searchParams.get("year") ?? "") || undefined;
    const compareYear =
      Number(request.nextUrl.searchParams.get("compareYear") ?? "") || undefined;
    const format = request.nextUrl.searchParams.get("format");
    const result = await getDrives({ year, compareYear });

    if (format === "csv") {
      const csv = buildDrivesCsv(result.data.drives);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="drives.csv"',
        },
      });
    }

    return NextResponse.json<ApiResponse<DrivesPayload>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("GET /api/tpo/drives failed.", error);
    const fallback = await getDrives({});
    return NextResponse.json<ApiResponse<DrivesPayload>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
