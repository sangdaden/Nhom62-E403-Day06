import { NextRequest, NextResponse } from "next/server";
import { runPromotion } from "@/lib/agent/promotion-worker";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "vinmec-demo-2026";

// POST /api/admin/flywheel/promote?key=...
export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // force=true bypasses the 5-min debounce
  const force = req.nextUrl.searchParams.get("force") === "true";

  const result = await runPromotion(force);

  return NextResponse.json(result);
}
