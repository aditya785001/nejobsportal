import { NextRequest, NextResponse } from "next/server";

/**
 * Translate English to Assamese using the free Google Translate API.
 * This avoids Windows pipe encoding issues with Python subprocess.
 */
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text || !text.trim()) {
      return NextResponse.json({ translation: "" });
    }

    const textSlice = text.slice(0, 1500);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=as&dt=t&q=${encodeURIComponent(textSlice)}`;

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: `Google Translate returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    // Response format: [["translated text", "original text", ...], ...]
    const translated = data?.[0]?.map((item: any) => item?.[0] || "").join("") || "";

    return NextResponse.json({ translation: translated });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Translation failed" },
      { status: 500 }
    );
  }
}
