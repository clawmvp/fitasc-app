import { NextRequest, NextResponse } from "next/server";
import { scrapeRankings } from "@/lib/scraper";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("fitasc_session");

  if (!session?.value) {
    return NextResponse.json(
      { error: "Autentificare necesara" },
      { status: 401 }
    );
  }

  try {
    const rankings = await scrapeRankings(session.value);
    return NextResponse.json(rankings);
  } catch (e) {
    console.error("Rankings fetch error:", e);
    return NextResponse.json(
      { error: "Eroare la incarcarea clasamentelor" },
      { status: 500 }
    );
  }
}
