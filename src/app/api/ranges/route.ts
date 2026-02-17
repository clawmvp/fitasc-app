import { NextRequest, NextResponse } from "next/server";
import { scrapeRanges } from "@/lib/scraper";
import { SHOOTING_RANGES } from "@/lib/data";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("fitasc_session");

  let ranges = SHOOTING_RANGES;

  if (session?.value) {
    try {
      const scraped = await scrapeRanges(session.value);
      if (scraped.length > 0) {
        ranges = scraped;
      }
    } catch (e) {
      console.error("Scrape ranges failed, using fallback:", e);
    }
  }

  return NextResponse.json({ ranges });
}
