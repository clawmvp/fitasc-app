import { NextRequest, NextResponse } from "next/server";
import { scrapeCompetitions } from "@/lib/scraper";
import { COMPETITIONS_2026, getCompetitionStatus } from "@/lib/data";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("fitasc_session");

  let competitions = COMPETITIONS_2026.map((c) => ({
    ...c,
    status: getCompetitionStatus(c),
  }));

  if (session?.value) {
    try {
      const scraped = await scrapeCompetitions(session.value);
      if (scraped.length > 0) {
        competitions = scraped;
      }
    } catch (e) {
      console.error("Scrape competitions failed, using fallback:", e);
    }
  }

  return NextResponse.json({ competitions });
}
