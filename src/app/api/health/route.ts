import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export async function GET() {
  const body: ApiResponse<{ status: string; timestamp: string }> = {
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    message: "Server is running",
  };

  return NextResponse.json(body);
}
