import { NextResponse } from "next/server";
import { getRegistryItem, getRegistryIndex } from "@/registry/registry";

const IMMUTABLE = "public, max-age=31536000, immutable";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name: rawName } = await params;
  const name = rawName.replace(/\.json$/i, "");

  // `index` / `index.json` serves the root registry so shadcn can discover items.
  if (name === "index" || name === "registry") {
    return NextResponse.json(getRegistryIndex(), {
      headers: { "Cache-Control": IMMUTABLE },
    });
  }

  const item = getRegistryItem(name);
  if (!item) {
    return NextResponse.json(
      { error: `Registry item "${name}" not found.` },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(item, {
    headers: { "Cache-Control": IMMUTABLE },
  });
}