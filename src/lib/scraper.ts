import { Competition, CompetitionResult, CategoryResult, Score, RankingEntry, SuperCupaEntry, ShootingRange } from "./types";
import { getCached, setCache } from "./cache";

const BASE_URL = "https://fitascsporting.ro";

async function fetchPage(path: string, sessionCookie?: string): Promise<string> {
  const headers: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ro-RO,ro;q=0.9,en;q=0.8",
  };

  if (sessionCookie) {
    headers["Cookie"] = sessionCookie;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }

  return res.text();
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ success: boolean; sessionCookie: string; userName: string }> {
  const loginPageRes = await fetch(`${BASE_URL}/login`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    redirect: "manual",
  });

  const loginPageCookies = loginPageRes.headers.getSetCookie?.() || [];
  const initialCookies = loginPageCookies.map((c) => c.split(";")[0]).join("; ");

  const loginPageHtml = await loginPageRes.text();
  const tokenMatch = loginPageHtml.match(/name="_token"\s+value="([^"]+)"/);
  const token = tokenMatch ? tokenMatch[1] : "";

  const formBody = new URLSearchParams({
    _token: token,
    email,
    password,
  });

  const loginRes = await fetch(`${BASE_URL}/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "Cookie": initialCookies,
      "Referer": `${BASE_URL}/login`,
    },
    body: formBody.toString(),
    redirect: "manual",
  });

  const setCookies = loginRes.headers.getSetCookie?.() || [];
  const sessionCookie = setCookies.map((c) => c.split(";")[0]).join("; ");

  const status = loginRes.status;
  const success = status === 302 || status === 301 || status === 200;

  let userName = "";
  if (success) {
    try {
      const dashHtml = await fetchPage("/dashboard", sessionCookie || initialCookies);
      const nameMatch = dashHtml.match(/(?:Bun venit|Salut|Hello),?\s*([^<!\n]+)/i)
        || dashHtml.match(/<span[^>]*class="[^"]*user[^"]*"[^>]*>([^<]+)<\/span>/i)
        || dashHtml.match(/<a[^>]*href="[^"]*profile[^"]*"[^>]*>([^<]+)<\/a>/i);
      if (nameMatch) {
        userName = nameMatch[1].trim();
      }
    } catch {
      // ignore - will use email as fallback
    }
  }

  return { success, sessionCookie: sessionCookie || initialCookies, userName };
}

export async function scrapePlayerHistory(
  personId: number,
  sessionCookie: string
): Promise<{
  competitions: Array<{
    id: number;
    name: string;
    location: string;
    hasScore: boolean;
    position?: number;
    totalCompetitors?: number;
    score?: number;
    percentage?: number;
    rounds?: number[];
    total1?: number;
    total2?: number;
  }>;
}> {
  const cacheKey = `history-${personId}`;
  const cached = getCached<ReturnType<typeof scrapePlayerHistory> extends Promise<infer T> ? T : never>(cacheKey);
  if (cached) return cached;

  const competitions: Array<{
    id: number;
    name: string;
    location: string;
    hasScore: boolean;
    position?: number;
    totalCompetitors?: number;
    score?: number;
    percentage?: number;
    rounds?: number[];
    total1?: number;
    total2?: number;
  }> = [];

  // Search through competition IDs 1-60 (historical) for this player
  for (const compId of [50, 29, 27, 26, 22, 21, 20, 18, 17, 16, 14, 13, 30, 35, 40, 45, 55, 60]) {
    try {
      const html = await fetchPage(`/clasament/${compId}`, sessionCookie);

      // Check if this player appears in the page
      const personIdStr = `"PersonId":${personId}`;
      if (!html.includes(personIdStr) && !html.includes(`PersonId": ${personId}`)) {
        continue;
      }

      // Extract competition info
      const nameMatch = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
      const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, "").trim() : `Competitie #${compId}`;
      const locMatch = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
      const location = locMatch ? locMatch[1].replace(/<[^>]+>/g, "").trim() : "";

      // Try to extract the player's result from JSON data in the page
      const jsonDataMatch = html.match(/var\s+(?:results|data|tableData)\s*=\s*(\[[\s\S]*?\]);/);
      if (jsonDataMatch) {
        try {
          const allResults = JSON.parse(jsonDataMatch[1]);
          const playerResult = allResults.find((r: Record<string, unknown>) => r.PersonId === personId);
          if (playerResult && playerResult.Total) {
            competitions.push({
              id: compId,
              name,
              location,
              hasScore: true,
              position: playerResult.Position || allResults.indexOf(playerResult) + 1,
              totalCompetitors: allResults.length,
              score: parseInt(String(playerResult.Total)) || 0,
              percentage: playerResult.Procent || 0,
              rounds: [
                playerResult.M1, playerResult.M2, playerResult.M3, playerResult.M4,
                playerResult.M5, playerResult.M6, playerResult.M7, playerResult.M8,
              ].filter((r: unknown) => r !== undefined && r !== null) as number[],
              total1: parseInt(String(playerResult.Total1)) || undefined,
              total2: parseInt(String(playerResult.Total2)) || undefined,
            });
            continue;
          }
        } catch {
          // JSON parse failed, player might just be registered
        }
      }

      // Player found but no score data - registered only
      competitions.push({
        id: compId,
        name,
        location,
        hasScore: false,
      });
    } catch {
      // Competition page failed to load, skip
    }
  }

  const result = { competitions };
  setCache(cacheKey, result, 60 * 60 * 1000); // cache 1 hour
  return result;
}

function parseCompetitionsFromHtml(html: string): Competition[] {
  const competitions: Competition[] = [];
  const regex = /data-id="(\d+)"[^>]*>[\s\S]*?<h4[^>]*>([\s\S]*?)<\/h4>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const id = parseInt(match[1]);
    const titleBlock = match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    const dateMatch = titleBlock.match(/(\d{4}-\d{2}-\d{2})\s+(\d{4}-\d{2}-\d{2})/);
    const disciplineMatch = titleBlock.match(/(Fitasc Sporting|Compak Sporting)/i);

    let name = titleBlock;
    if (dateMatch) name = titleBlock.substring(0, titleBlock.indexOf(dateMatch[0])).trim();

    const locationMatch = name.match(/(?:Lugoj|Bucuresti|Ludus|Baia Mare)[^,]*/i);
    const rangeMatch = name.match(/Poligon\s+[\w\s]+/i);

    competitions.push({
      id,
      name: name.replace(/,?\s*(Poligon\s+[\w\s]+)/i, "").trim(),
      type: name.includes("CAMPIONAT") ? "Campionat National" :
            name.includes("GRAND PRIX") ? "Grand Prix" :
            name.includes("CUPA") ? "Cupa Romaniei" :
            name.includes("FINALA") ? "Finala" : "Competitie",
      discipline: disciplineMatch ? disciplineMatch[1] : "Fitasc Sporting",
      status: "upcoming",
      location: locationMatch ? locationMatch[0].trim() : "",
      range: rangeMatch ? rangeMatch[0].trim() : "",
      dateStart: dateMatch ? dateMatch[1] : "",
      dateEnd: dateMatch ? dateMatch[2] : "",
    });
  }

  return competitions;
}

function parseScoresFromHtml(html: string): CategoryResult[] {
  const categories: CategoryResult[] = [];

  const categoryBlocks = html.split(/(?=<h[34][^>]*>(?:Open|Ladies|Junior|Senior|Veteran))/i);

  for (const block of categoryBlocks) {
    const catMatch = block.match(/<h[34][^>]*>(Open|Ladies|Junior|Senior|Veteran)<\/h[34]>/i);
    if (!catMatch) continue;

    const category = catMatch[1];
    const scores: Score[] = [];
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    let position = 1;

    while ((rowMatch = rowRegex.exec(block)) !== null) {
      const cells: string[] = [];
      const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let cellMatch;

      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(cellMatch[1].replace(/<[^>]+>/g, "").trim());
      }

      if (cells.length >= 3) {
        const playerName = cells[0] || cells[1];
        const rounds: number[] = [];
        let total = 0;

        for (let i = 1; i < cells.length; i++) {
          const num = parseInt(cells[i]);
          if (!isNaN(num)) {
            if (i < cells.length - 2) {
              rounds.push(num);
            }
          }
        }

        total = rounds.reduce((a, b) => a + b, 0);
        const maxPossible = rounds.length * 25;
        const percentage = maxPossible > 0 ? (total / maxPossible) * 100 : 0;

        if (playerName && playerName !== "") {
          scores.push({
            position: position++,
            player: { name: playerName, category },
            rounds,
            total,
            percentage: Math.round(percentage * 10) / 10,
          });
        }
      }
    }

    if (scores.length > 0) {
      categories.push({ category, scores });
    }
  }

  return categories;
}

function parseRangesFromHtml(html: string): ShootingRange[] {
  const ranges: ShootingRange[] = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;

  while ((match = rowRegex.exec(html)) !== null) {
    const cells: string[] = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cellMatch;

    while ((cellMatch = cellRegex.exec(match[1])) !== null) {
      cells.push(cellMatch[1].replace(/<[^>]+>/g, "").trim());
    }

    if (cells.length >= 2) {
      ranges.push({
        name: cells[0],
        location: cells[1] || "",
        address: cells[2] || "",
        phone: cells[3] || "",
        country: cells[4] || "Romania",
      });
    }
  }

  return ranges;
}

export async function scrapeCompetitions(sessionCookie: string): Promise<Competition[]> {
  const cacheKey = "competitions";
  const cached = getCached<Competition[]>(cacheKey);
  if (cached) return cached;

  try {
    const html = await fetchPage("/competitii", sessionCookie);
    const competitions = parseCompetitionsFromHtml(html);
    if (competitions.length > 0) {
      setCache(cacheKey, competitions);
      return competitions;
    }
  } catch (e) {
    console.error("Failed to scrape competitions:", e);
  }

  return [];
}

export async function scrapeCompetitionResult(
  id: number,
  sessionCookie: string
): Promise<CompetitionResult | null> {
  const cacheKey = `competition-${id}`;
  const cached = getCached<CompetitionResult>(cacheKey);
  if (cached) return cached;

  try {
    const html = await fetchPage(`/clasament/${id}`, sessionCookie);
    const categories = parseScoresFromHtml(html);

    const nameMatch = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
    const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, "").trim() : "";

    const result: CompetitionResult = {
      competition: {
        id,
        name,
        type: "Competitie",
        discipline: "Fitasc Sporting",
        status: "completed",
        location: "",
        range: "",
        dateStart: "",
        dateEnd: "",
      },
      categories,
    };

    setCache(cacheKey, result, 30 * 60 * 1000);
    return result;
  } catch (e) {
    console.error(`Failed to scrape competition ${id}:`, e);
    return null;
  }
}

export async function scrapeRanges(sessionCookie: string): Promise<ShootingRange[]> {
  const cacheKey = "ranges";
  const cached = getCached<ShootingRange[]>(cacheKey);
  if (cached) return cached;

  try {
    const html = await fetchPage("/poligoane", sessionCookie);
    const ranges = parseRangesFromHtml(html);
    if (ranges.length > 0) {
      setCache(cacheKey, ranges);
      return ranges;
    }
  } catch (e) {
    console.error("Failed to scrape ranges:", e);
  }

  return [];
}

export async function scrapeRankings(sessionCookie: string): Promise<{
  superCupa: SuperCupaEntry[];
  general: RankingEntry[];
}> {
  const cacheKey = "rankings";
  const cached = getCached<{ superCupa: SuperCupaEntry[]; general: RankingEntry[] }>(cacheKey);
  if (cached) return cached;

  try {
    const html = await fetchPage("/clasamente", sessionCookie);

    const result = {
      superCupa: [] as SuperCupaEntry[],
      general: [] as RankingEntry[],
    };

    setCache(cacheKey, result);
    return result;
  } catch (e) {
    console.error("Failed to scrape rankings:", e);
  }

  return { superCupa: [], general: [] };
}
