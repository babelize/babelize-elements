import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const REGISTRY_URL = process.env.BABELIZE_REGISTRY ?? "https://elements.babelize.co/r";
const BASE_URL = REGISTRY_URL.replace(/\/r\/?$/, "");

const DEFAULT_ALIASES = {
  components: "@/components",
  ui: "@/components/ui",
  lib: "@/lib",
  utils: "@/lib/utils",
  hooks: "@/hooks",
};

const GREEN = "\u001b[32m";
const RED = "\u001b[31m";
const CYAN = "\u001b[36m";
const BOLD = "\u001b[1m";
const RESET = "\u001b[0m";

interface RegistryFile {
  path: string;
  type: string;
  content?: string;
}

interface RegistryItem {
  $schema?: string;
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
}

const projectRoot = process.cwd();

function log(message = ""): void {
  process.stdout.write(`${message}\n`);
}

function error(message: string): void {
  process.stderr.write(`${RED}${message}${RESET}\n`);
}

function readComponentsJson(): { aliases?: Record<string, string> } {
  try {
    return JSON.parse(readFileSync(join(projectRoot, "components.json"), "utf8"));
  } catch {
    return {};
  }
}

function resolveAliases(): Record<string, string> {
  const user = readComponentsJson().aliases ?? {};
  return { ...DEFAULT_ALIASES, ...user };
}

function aliasToDir(alias: string): string {
  return alias.replace(/^@\//, "");
}

async function fetchItem(name: string): Promise<RegistryItem> {
  const url = `${REGISTRY_URL}/${name}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch "${name}" from ${url} (HTTP ${res.status}).`);
  }
  return (await res.json()) as RegistryItem;
}

function detectPackageManager(): string {
  if (existsSync(join(projectRoot, "bun.lock")) || existsSync(join(projectRoot, "bun.lockb"))) {
    return "bun";
  }
  if (existsSync(join(projectRoot, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(projectRoot, "yarn.lock"))) return "yarn";
  return "npm";
}

function installDependencies(pm: string, deps: string[]): void {
  const args = pm === "npm" ? ["install", ...deps] : ["add", ...deps];
  log(`\n${CYAN}Installing dependencies with ${pm}${RESET}`);
  const result = spawnSync(pm, args, { cwd: projectRoot, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function resolveDestination(file: RegistryFile, aliases: Record<string, string>): string {
  const dir =
    file.type === "registry:lib"
      ? aliasToDir(aliases.lib)
      : aliasToDir(aliases.components);
  const pathInDir = file.path.replace(/^(components|lib|ui|hooks)\//, "");
  return join(projectRoot, dir, pathInDir);
}

function rewriteImports(content: string, aliases: Record<string, string>): string {
  return content.replaceAll("@/lib/utils", aliases.utils);
}

function writeItem(
  item: RegistryItem,
  aliases: Record<string, string>,
  written: Set<string>,
): void {
  for (const file of item.files ?? []) {
    if (!file.content) continue;
    const dest = resolveDestination(file, aliases);
    if (written.has(dest)) continue;
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, rewriteImports(file.content, aliases), "utf8");
    written.add(dest);
    log(`  ${GREEN}✓${RESET} ${basename(dest)}`);
  }
}

async function addComponents(names: string[], aliases: Record<string, string>): Promise<void> {
  const visited = new Set<string>();
  const written = new Set<string>();
  const deps = new Set<string>();

  async function addItem(name: string): Promise<void> {
    if (visited.has(name)) return;
    visited.add(name);

    const item = await fetchItem(name);
    log(`\n${BOLD}${item.title ?? item.name}${RESET}`);
    if (item.description) log(`  ${item.description}`);

    for (const dep of item.dependencies ?? []) deps.add(dep);
    writeItem(item, aliases, written);

    for (const dep of item.registryDependencies ?? []) {
      await addItem(dep);
    }
  }

  for (const name of names) {
    await addItem(name);
  }

  if (deps.size > 0) {
    installDependencies(detectPackageManager(), [...deps]);
  }

  log(`\n${GREEN}${BOLD}Done.${RESET} Components written to ${aliases.components}.`);
}

async function listComponents(): Promise<void> {
  const res = await fetch(`${BASE_URL}/registry.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch registry index (HTTP ${res.status}).`);
  }
  const index = (await res.json()) as { name: string; items: RegistryItem[] };
  log(`${BOLD}${index.name}${RESET} registry\n`);
  for (const item of index.items) {
    const title = item.title ?? item.name;
    log(`  ${CYAN}${item.name}${RESET} — ${item.description ?? title}`);
  }
  log(`\nInstall a component:\n  npx shadcn@latest add @elements/<component>`);
  log(`  npx @babelize/elements add <component>`);
}

function printUsage(): void {
  log(`${BOLD}Babelize Elements CLI${RESET}`);
  log(`\nUsage:\n  babelize add <component...>   Install components into your project`);
  log(`  babelize list                  List available components\n`);
  log(`Options:\n  --help                       Show this help\n`);
  log(`Registry:\n  Set BABELIZE_REGISTRY to override the registry URL (default ${REGISTRY_URL}).`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "--help" || command === "-h" || !command) {
    printUsage();
    return;
  }

  const aliases = resolveAliases();

  try {
    if (command === "add") {
      const names = args.slice(1);
      if (names.length === 0) {
        error("No components specified. Usage: babelize add <component...>");
        process.exit(1);
      }
      await addComponents(names, aliases);
    } else if (command === "list") {
      await listComponents();
    } else {
      error(`Unknown command: ${command}`);
      printUsage();
      process.exit(1);
    }
  } catch (err) {
    error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

main();