import { NextResponse } from "next/server";
import { getRegistryIndex } from "@/registry/registry";

const CACHE = "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";

export async function GET() {
  return NextResponse.json(getRegistryIndex(), {
    headers: { "Cache-Control": CACHE },
  });
}
