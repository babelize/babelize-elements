import { NextResponse } from "next/server";
import { getRegistryItem, getRegistryIndex } from "@/registry/registry";

const CACHE = "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name: rawName } = await params;
  const name = rawName.replace(/\.json$/i, "");

  // shadcn discovers a registry by fetching `<base>/index.json`, so this alias has
  // to stay alongside the dedicated /registry.json route.
  if (name === "index" || name === "registry") {
    return NextResponse.json(getRegistryIndex(), {
      headers: { "Cache-Control": CACHE },
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
    headers: { "Cache-Control": CACHE },
  });
}
