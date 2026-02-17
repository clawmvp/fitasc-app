export interface Competition {
  id: number;
  name: string;
  type: "Campionat National" | "Grand Prix" | "Cupa Romaniei" | "Finala" | string;
  discipline: "Fitasc Sporting" | "Compak Sporting" | string;
  status: "upcoming" | "ongoing" | "completed";
  location: string;
  range: string;
  dateStart: string;
  dateEnd: string;
  mapUrl?: string;
  phone?: string;
  participantCount?: number;
}

export interface Player {
  id?: number;
  name: string;
  club?: string;
  team?: string;
  category: PlayerCategory;
}

export type PlayerCategory = "A" | "B" | "C" | "FEM" | "JR F" | "JR M" | "SEN" | "VET" | "STR" | string;

export interface Score {
  position: number;
  player: Player;
  rounds: number[];
  total: number;
  percentage: number;
}

export interface CompetitionResult {
  competition: Competition;
  categories: CategoryResult[];
}

export interface CategoryResult {
  category: PlayerCategory;
  scores: Score[];
}

export interface RankingEntry {
  position: number;
  player: Player;
  participations: number;
  percentage: number;
  classPercentage?: number;
  points?: number;
}

export interface SuperCupaEntry {
  position: number;
  player: Player;
  points: number;
  participations: number;
}

export interface ShootingRange {
  id?: number;
  name: string;
  location: string;
  address?: string;
  phone?: string;
  country: string;
  mapUrl?: string;
}

export interface UserSession {
  email: string;
  loggedIn: boolean;
  sessionCookie?: string;
}

export type TabId = "profil" | "clasamente" | "competitii" | "rezultate" | "poligoane" | "regulamente";

export interface RegisteredPlayer {
  Position: number;
  Person: string;
  Category: string | null;
  Team: string | null;
  PersonId: number;
  Procent: number;
}
