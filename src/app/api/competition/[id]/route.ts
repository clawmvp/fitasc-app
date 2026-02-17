import { NextRequest, NextResponse } from "next/server";
import { scrapeCompetitionResult } from "@/lib/scraper";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = request.cookies.get("fitasc_session");

  if (!session?.value) {
    return NextResponse.json(
      { error: "Autentificare necesara" },
      { status: 401 }
    );
  }

  const competitionId = parseInt(id);
  if (isNaN(competitionId)) {
    return NextResponse.json(
      { error: "ID competitie invalid" },
      { status: 400 }
    );
  }

  try {
    const result = await scrapeCompetitionResult(competitionId, session.value);
    if (!result) {
      return NextResponse.json(
        { error: "Competitia nu a fost gasita" },
        { status: 404 }
      );
    }
    return NextResponse.json(result);
  } catch (e) {
    console.error(`Competition ${id} fetch error:`, e);
    return NextResponse.json(
      { error: "Eroare la incarcarea rezultatelor" },
      { status: 500 }
    );
  }
}
