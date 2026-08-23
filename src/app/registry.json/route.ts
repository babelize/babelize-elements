import { NextResponse } from "next/server";
import { getRegistryIndex } from "@/registry/registry";

const IMMUTABLE = "public, max-age=31536000, immutable";

export async function GET() {
  return NextResponse.json(getRegistryIndex(), {
    headers: { "Cache-Control": IMMUTABLE },
  });
}