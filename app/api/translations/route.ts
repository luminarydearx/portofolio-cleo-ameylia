import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const TRANSLATIONS_PATH = path.join(process.cwd(), "lib", "translations.ts");

function parseTranslations(content: string): Record<string, unknown> | null {
  try {
    const match = content.match(/export const translations\s*=\s*(\{[\s\S]*\})\s*as\s*const\s*;/);
    if (!match) return null;
    const fn = new Function(`return ${match[1]}`);
    return fn();
  } catch { return null; }
}

function serializeValue(val: unknown, indent: number): string {
  const pad = "  ".repeat(indent);
  const pad1 = "  ".repeat(indent + 1);
  if (typeof val === "string") return JSON.stringify(val);
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    if (val.every(v => typeof v === "string")) {
      const items = val.map(v => JSON.stringify(v));
      const oneLine = `[${items.join(", ")}]`;
      if (oneLine.length < 80) return oneLine;
      return `[\n${items.map(i => `${pad1}${i}`).join(",\n")},\n${pad}]`;
    }
    const items = val.map(v => `${pad1}${serializeValue(v, indent + 1)}`);
    return `[\n${items.join(",\n")},\n${pad}]`;
  }
  if (val && typeof val === "object") {
    const entries = Object.entries(val as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const lines = entries.map(([k, v]) => {
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
      return `${pad1}${key}: ${serializeValue(v, indent + 1)}`;
    });
    return `{\n${lines.join(",\n")},\n${pad}}`;
  }
  return "undefined";
}

function generateTranslationsFile(data: Record<string, unknown>): string {
  const localeEntries = Object.entries(data);
  const body = localeEntries
    .map(([locale, val]) => `  ${locale}: ${serializeValue(val, 1)}`)
    .join(",\n\n");

  return `export type Locale = "en" | "id" | "es" | "ja" | "fr";

export const locales: { code: Locale; label: string; flag: string; name: string }[] = [
  { code: "en", label: "EN", flag: "🇺🇸", name: "English" },
  { code: "id", label: "ID", flag: "🇮🇩", name: "Bahasa Indonesia" },
  { code: "es", label: "ES", flag: "🇪🇸", name: "Español" },
  { code: "ja", label: "JA", flag: "🇯🇵", name: "日本語" },
  { code: "fr", label: "FR", flag: "🇫🇷", name: "Français" },
];

export type TranslationKey = typeof translations.en;

export const translations = {
${body},
} as const;
`;
}

export async function GET() {
  try {
    const content = fs.readFileSync(TRANSLATIONS_PATH, "utf-8");
    const data = parseTranslations(content);
    if (!data) return NextResponse.json({ error: "Failed to parse" }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to read" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const fileContent = generateTranslationsFile(body);
    
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      const repo = process.env.GITHUB_REPO;
      const branch = process.env.GITHUB_BRANCH || "master";
      const filePath = "lib/translations.ts";
      
      const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`, {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
      });
      
      let sha = "";
      if (getRes.ok) {
        const getJson = await getRes.json();
        sha = getJson.sha;
      }
      
      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
        body: JSON.stringify({
          message: "Update translations via CMS",
          content: Buffer.from(fileContent).toString("base64"),
          sha: sha || undefined,
          branch,
        }),
      });
      
      if (!putRes.ok) throw new Error("Failed to push to GitHub");
    } else {
      fs.writeFileSync(TRANSLATIONS_PATH, fileContent, "utf-8");
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to write" }, { status: 500 });
  }
}
