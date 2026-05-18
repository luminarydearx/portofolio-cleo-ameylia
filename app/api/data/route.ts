import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "portfolio-data.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const content = JSON.stringify(body, null, 2);
    
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      const repo = process.env.GITHUB_REPO;
      const branch = process.env.GITHUB_BRANCH || "master";
      const filePath = "data/portfolio-data.json";
      
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
          message: "Update portfolio data via CMS",
          content: Buffer.from(content).toString("base64"),
          sha: sha || undefined,
          branch,
        }),
      });
      
      if (!putRes.ok) throw new Error("Failed to push to GitHub");
    } else {
      fs.writeFileSync(DATA_PATH, content, "utf-8");
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to write data" }, { status: 500 });
  }
}
