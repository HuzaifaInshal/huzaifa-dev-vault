import "server-only";
import fs from "fs";
import path from "path";
import type { DocMeta, DocPage } from "./registry";

const DOCS_DIR = path.join(process.cwd(), "src", "documentation");

function collectMdxFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectMdxFiles(full));
    else if (entry.name.endsWith(".mdx")) results.push(full);
  }
  return results;
}

/** Extract `export const meta = {...}` from MDX source via regex. */
function extractMeta(source: string): DocMeta | undefined {
  const match = source.match(/export\s+const\s+meta\s*=\s*(\{[\s\S]*?\})\s*;/);
  if (!match) return undefined;
  try {
    // eslint-disable-next-line no-new-func
    return new Function(`return ${match[1]}`)() as DocMeta;
  } catch {
    return undefined;
  }
}

/** Build the flat list of all MDX pages from the documentation directory. */
export function buildRegistry(): DocPage[] {
  const files = collectMdxFiles(DOCS_DIR);

  const pages = files.map((filePath) => {
    const source = fs.readFileSync(filePath, "utf-8");
    const meta = extractMeta(source);

    const relative = filePath.replace(DOCS_DIR, "").replace(".mdx", "");
    const segments = relative.split(path.sep).filter(Boolean);
    const last = segments[segments.length - 1];
    const prev = segments[segments.length - 2];

    if (last === "index") {
      segments.pop();
    } else if (last && prev === last) {
      segments.pop();
    }

    const routePath = segments.length > 0 ? `/${segments.join("/")}` : "/";
    return { path: routePath, filePath, meta };
  });

  return pages.sort((a, b) => {
    const ao = a.meta?.order ?? 999;
    const bo = b.meta?.order ?? 999;
    if (ao !== bo) return ao - bo;
    return (a.meta?.title ?? "").localeCompare(b.meta?.title ?? "");
  });
}

/** Resolve a filePath to its import map key. */
export function getImportKey(filePath: string): string {
  return filePath.replace(DOCS_DIR, "").replace(/\\/g, "/");
}
