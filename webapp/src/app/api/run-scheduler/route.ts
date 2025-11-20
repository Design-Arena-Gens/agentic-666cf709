import { NextResponse } from "next/server";
import { executeScheduler } from "@/lib/actions";

export const runtime = "nodejs";

export async function POST() {
  try {
    const result = await executeScheduler();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[scheduler]", error);
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
