import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang = "auto", targetLangs } = await req.json();

    if (!text || !targetLangs || !Array.isArray(targetLangs)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const results: Record<string, string> = {};

    // Translate to all requested languages in parallel
    await Promise.all(
      targetLangs.map(async (lang) => {
        try {
          const res = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`
          );
          
          if (!res.ok) {
            throw new Error(`API returned ${res.status}`);
          }
          
          const data = await res.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const translatedText = data[0].map((item: any) => item[0]).join("");
          results[lang] = translatedText;
        } catch (err) {
          console.error(`Failed to translate to ${lang}:`, err);
          results[lang] = text; // Fallback to original text if translation fails
        }
      })
    );

    return NextResponse.json({ translations: results });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
