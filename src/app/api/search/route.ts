import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// Backs the docs search dialog (Cmd+K), which queries /api/search by default.
export const { GET } = createFromSource(source);
