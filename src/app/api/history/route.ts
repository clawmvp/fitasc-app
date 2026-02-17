import { NextRequest, NextResponse } from "next/server";
import { scrapePlayerHistory } from "@/lib/scraper";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("fitasc_session");

  if (!session?.value) {
    return NextResponse.json(
      { error: "Autentificare necesara" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const personId = searchParams.get("personId");

  if (!personId) {
    return NextResponse.json(
      { error: "PersonId este necesar" },
      { status: 400 }
    );
  }

  try {
    const history = await scrapePlayerHistory(
      parseInt(personId),
      session.value
    );
    return NextResponse.json(history);
  } catch (error) {
    console.error("History scrape error:", error);
    return NextResponse.json(
      { error: "Nu s-au putut incarca datele istorice" },
      { status: 500 }
    );
  }
}
