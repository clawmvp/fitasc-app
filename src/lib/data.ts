import { Competition, ShootingRange, RankingEntry, SuperCupaEntry, CompetitionResult } from "./types";

export const COMPETITIONS_2026: Competition[] = [
  {
    id: 61,
    name: "ETAPA 1 CAMPIONAT NATIONAL",
    type: "Campionat National",
    discipline: "Compak Sporting",
    status: "upcoming",
    location: "Lugoj",
    range: "Poligon MTI Shooting",
    dateStart: "2026-03-21",
    dateEnd: "2026-03-22",
    mapUrl: "https://goo.gl/maps/KbPW3uE4UNfcoLYR7",
    phone: "0761087183",
  },
  {
    id: 62,
    name: "ETAPA 1 CAMPIONAT NATIONAL",
    type: "Campionat National",
    discipline: "Fitasc Sporting",
    status: "upcoming",
    location: "Bucuresti",
    range: "Poligon Iosif Sarbu",
    dateStart: "2026-04-25",
    dateEnd: "2026-04-26",
    mapUrl: "https://goo.gl/maps/YPxKEdeXMRU4yRvV9",
  },
  {
    id: 63,
    name: "ETAPA 2 CAMPIONAT NATIONAL",
    type: "Campionat National",
    discipline: "Fitasc Sporting",
    status: "upcoming",
    location: "Ludus",
    range: "Poligon Opris Tiberiu",
    dateStart: "2026-05-16",
    dateEnd: "2026-05-17",
    mapUrl: "https://goo.gl/maps/uYtpSu5X4Rd5UBkz6",
  },
  {
    id: 64,
    name: "ETAPA 3 CAMPIONAT NATIONAL",
    type: "Campionat National",
    discipline: "Fitasc Sporting",
    status: "upcoming",
    location: "Lugoj",
    range: "Poligon MTI Shooting",
    dateStart: "2026-06-13",
    dateEnd: "2026-06-14",
    mapUrl: "https://goo.gl/maps/KbPW3uE4UNfcoLYR7",
  },
  {
    id: 65,
    name: "ETAPA 4 CAMPIONAT NATIONAL",
    type: "Campionat National",
    discipline: "Fitasc Sporting",
    status: "upcoming",
    location: "Ludus",
    range: "Poligon Opris Tiberiu",
    dateStart: "2026-07-11",
    dateEnd: "2026-07-12",
    mapUrl: "https://goo.gl/maps/uYtpSu5X4Rd5UBkz6",
  },
  {
    id: 66,
    name: "CUPA ROMANIEI",
    type: "Cupa Romaniei",
    discipline: "Fitasc Sporting",
    status: "upcoming",
    location: "Baia Mare",
    range: "Poligon Baia Mare",
    dateStart: "2026-08-08",
    dateEnd: "2026-08-09",
  },
  {
    id: 67,
    name: "ETAPA 2 CAMPIONAT NATIONAL",
    type: "Campionat National",
    discipline: "Compak Sporting",
    status: "upcoming",
    location: "Buftea",
    range: "Poligon Buftea",
    dateStart: "2026-08-22",
    dateEnd: "2026-08-23",
  },
  {
    id: 68,
    name: "FINALA CAMPIONAT NATIONAL",
    type: "Finala",
    discipline: "Fitasc Sporting",
    status: "upcoming",
    location: "Lugoj",
    range: "Poligon MTI Shooting",
    dateStart: "2026-09-12",
    dateEnd: "2026-09-13",
    mapUrl: "https://goo.gl/maps/KbPW3uE4UNfcoLYR7",
  },
  {
    id: 69,
    name: "ETAPA 3 CAMPIONAT NATIONAL",
    type: "Campionat National",
    discipline: "Compak Sporting",
    status: "upcoming",
    location: "Baia Mare",
    range: "Poligon Baia Mare",
    dateStart: "2026-09-26",
    dateEnd: "2026-09-27",
  },
  {
    id: 70,
    name: "GRAND PRIX OF ROMANIA",
    type: "Grand Prix",
    discipline: "Fitasc Sporting",
    status: "upcoming",
    location: "Ludus",
    range: "Poligon Opris Tiberiu",
    dateStart: "2026-10-10",
    dateEnd: "2026-10-11",
    mapUrl: "https://goo.gl/maps/uYtpSu5X4Rd5UBkz6",
  },
  {
    id: 71,
    name: "FINALA CAMPIONAT NATIONAL",
    type: "Finala",
    discipline: "Compak Sporting",
    status: "upcoming",
    location: "Bucuresti",
    range: "Poligon Iosif Sarbu",
    dateStart: "2026-11-07",
    dateEnd: "2026-11-08",
    mapUrl: "https://goo.gl/maps/YPxKEdeXMRU4yRvV9",
  },
];

export const SHOOTING_RANGES: ShootingRange[] = [
  {
    id: 1,
    name: "MTI Shooting",
    location: "Lugoj, Timis",
    address: "Str. Buziasului, Lugoj 305500",
    phone: "0761087183",
    country: "Romania",
    mapUrl: "https://goo.gl/maps/KbPW3uE4UNfcoLYR7",
  },
  {
    id: 2,
    name: "Poligon Opris Tiberiu",
    location: "Ludus, Mures",
    address: "Ludus, Mures",
    country: "Romania",
    mapUrl: "https://goo.gl/maps/uYtpSu5X4Rd5UBkz6",
  },
  {
    id: 3,
    name: "Poligon Iosif Sarbu",
    location: "Bucuresti",
    address: "Bucuresti",
    country: "Romania",
    mapUrl: "https://goo.gl/maps/YPxKEdeXMRU4yRvV9",
  },
  {
    id: 4,
    name: "Poligon Baia Mare",
    location: "Baia Mare, Maramures",
    country: "Romania",
  },
];

export const SUPER_CUPA_POINTS: Record<number, number> = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1,
};

export const CATEGORIES = ["A", "B", "C", "FEM", "JR F", "JR M", "SEN", "VET", "STR"] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  A: "Categoria A",
  B: "Categoria B",
  C: "Categoria C",
  FEM: "Feminin",
  "JR F": "Junior Feminin",
  "JR M": "Junior Masculin",
  SEN: "Senior",
  VET: "Veteran",
  STR: "Strain",
};

export const DISCIPLINES = ["Fitasc Sporting", "Compak Sporting"] as const;

export const REGULATIONS = [
  {
    title: "Regulament Sporting FITASC",
    url: "https://www.fitasc.com/upload/images/reglements/2025_rglt_pc_eng.pdf",
    description: "Regulamentul oficial FITASC pentru parcursul de sporting",
  },
  {
    title: "Regulamente FITASC Generale",
    url: "https://www.fitasc.com/uk/content/10",
    description: "Toate regulamentele FITASC International",
  },
  {
    title: "Regulament Inscriere 2025",
    url: "https://www.fitasc.com/upload/images/cg_inscrip_2025/20241122_cg_en_newsletter/20241122_newsletter_en.pdf",
    description: "Noul regulament pentru inscriere si anulare inscriere la competitii FITASC",
  },
];

export const RULES_SUMMARY = {
  enrollment: {
    deadline: "Joia, ora 18:00, din saptamana competitiei",
    cancellation: "Gratis cu 24h inainte. Taxa 100 RON daca anulezi in ultimele 24h",
    lateFee: "50 RON penalizare inscriere dupa termen",
    entryFee: "350 RON taxa de inscriere",
    protestFee: "200 RON taxa contestatie",
  },
  ranking: {
    bestResults: "Cele mai bune 3 rezultate din anul precedent",
    finaleMinParticipations: 3,
    description: "Minim 3 participari la etapele nationale pentru a participa la finala",
  },
  superCupa: {
    description: "Clasament national cu toti participantii la toate competitiile nationale Sporting",
    points: "1=25p, 2=18p, 3=15p, 4=12p, 5=10p, 6=8p, 7=6p, 8=4p, 9=2p, 10=1p",
    eligibility: "Doar sportivi romani",
    award: "Premierea la Grand Prix Romania (sfarsitul anului)",
  },
};

export const USEFUL_LINKS = [
  { title: "Calendar competitional 2025 FRTS", url: "https://frts.ro/images/articole/2024/20241105/Calendar_competitional_intern_si_international_2025.pdf" },
  { title: "Federatia Romana de Tir Sportiv", url: "http://frts.ro/" },
  { title: "FITASC International", url: "https://www.fitasc.com/" },
  { title: "Sporting Romania (oficial)", url: "https://fitascsporting.ro/" },
  { title: "Concursuri Ungaria", url: "http://fitascsporting.hu/index.php?page=versenyek" },
  { title: "AGVPS Romania", url: "https://www.agvps.ro/" },
  { title: "Revista Vanatorul si Pescarul Roman", url: "https://www.agvps.ro/revista.html" },
];

export function getNextCompetition(competitions: Competition[]): Competition | null {
  const now = new Date();
  const upcoming = competitions
    .filter((c) => new Date(c.dateStart) > now)
    .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
  return upcoming[0] || null;
}

export function getCompetitionStatus(comp: Competition): "upcoming" | "ongoing" | "completed" {
  const now = new Date();
  const start = new Date(comp.dateStart);
  const end = new Date(comp.dateEnd);
  end.setHours(23, 59, 59);
  if (now < start) return "upcoming";
  if (now <= end) return "ongoing";
  return "completed";
}

export function getDaysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
  });
}
