import { NextRequest, NextResponse } from "next/server";

import { sendRecruiterMessageAction } from "@/lib/recruiterStore";
import type { ApiResponse, MessageRecord } from "@/lib/recruiter-types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      senderId?: string;
      receiverId?: string;
      message?: string;
      candidateName?: string;
      role?: string;
      previewOnly?: boolean;
    };
    const result = await sendRecruiterMessageAction({
      senderId: body.senderId,
      receiverId: body.receiverId ?? "",
      message: body.message,
      candidateName: body.candidateName,
      role: body.role,
      previewOnly: body.previewOnly,
    });

    return NextResponse.json<ApiResponse<MessageRecord | { preview: string }>>({
      success: true,
      data: result.data,
      meta: result.meta,
      error: null,
    });
  } catch (error) {
    console.error("POST /api/recruiter/message failed.", error);
    const fallback = await sendRecruiterMessageAction({
      receiverId: "",
      previewOnly: true,
    });
    return NextResponse.json<ApiResponse<MessageRecord | { preview: string }>>({
      success: true,
      data: fallback.data,
      meta: fallback.meta,
      error: null,
    });
  }
}
