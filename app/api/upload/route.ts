import { NextRequest, NextResponse } from "next/server";

const CLOUDINARY_CLOUD_NAME = "dg3awuzug";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      { method: "POST", body: uploadData }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: "Upload failed", details: err }, { status: 500 });
    }

    const result = await res.json();
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
