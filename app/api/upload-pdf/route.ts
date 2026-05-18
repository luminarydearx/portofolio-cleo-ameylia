import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const publicDir = path.join(process.cwd(), "public");
    const filePath = path.join(publicDir, "resume.pdf");

    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, url: "/resume.pdf" });
  } catch (error) {
    console.error("PDF upload error:", error);
    return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 });
  }
}
