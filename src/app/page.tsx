"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Competition,
  CompetitionResult,
  ShootingRange,
  RankingEntry,
  SuperCupaEntry,
  TabId,
  PlayerCategory,
  RegisteredPlayer,
} from "@/lib/types";
import {
  COMPETITIONS_2026,
  SHOOTING_RANGES,
  REGULATIONS,
  RULES_SUMMARY,
  USEFUL_LINKS,
  CATEGORIES,
  CATEGORY_LABELS,
  DISCIPLINES,
  getNextCompetition,
  getCompetitionStatus,
  getDaysUntil,
  formatDate,
  formatDateShort,
} from "@/lib/data";
import { ALL_PLAYERS, getTeammates, getCategoryCount } from "@/lib/players-data";

/* ───────────── LOADING SKELETON ───────────── */
function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton h-24 w-full" />
      ))}
    </div>
  );
}

/* ───────────── TARGET ICON SVG ───────────── */
function TargetIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

/* ───────────── TROPHY ICON SVG ───────────── */
function TrophyIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

/* ───────────── CALENDAR ICON SVG ───────────── */
function CalendarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

/* ───────────── MAP PIN ICON SVG ───────────── */
function MapPinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ───────────── PHONE ICON SVG ───────────── */
function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/* ───────────── LINK ICON SVG ───────────── */
function LinkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/* ───────────── USER ICON SVG ───────────── */
function UserIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/* ───────────── USERS ICON SVG ───────────── */
function UsersIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/* ───────────── LOGOUT ICON SVG ───────────── */
function LogoutIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════ */
/* ═══════════════ MAIN COMPONENT ═══════════════ */
/* ═══════════════════════════════════════════════ */

export default function FitascApp() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // App state
  const [activeTab, setActiveTab] = useState<TabId>("profil");
  const [competitions, setCompetitions] = useState<Competition[]>(
    COMPETITIONS_2026.map((c) => ({ ...c, status: getCompetitionStatus(c) }))
  );
  const [ranges, setRanges] = useState<ShootingRange[]>(SHOOTING_RANGES);
  const [selectedCompetition, setSelectedCompetition] = useState<number | null>(null);
  const [competitionResult, setCompetitionResult] = useState<CompetitionResult | null>(null);
  const [rankings, setRankings] = useState<{ superCupa: SuperCupaEntry[]; general: RankingEntry[] }>({
    superCupa: [],
    general: [],
  });
  const [loading, setLoading] = useState(false);
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<PlayerCategory | "all">("all");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Profile state - for name search when auto-detect fails
  const [nameSearch, setNameSearch] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [playerHistory, setPlayerHistory] = useState<{
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
  } | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const nextComp = getNextCompetition(competitions);

  // Check auth on mount
  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data) => {
        if (data.loggedIn) {
          setIsLoggedIn(true);
          setUserEmail(data.email);
          if (data.userName) setUserName(data.userName);
        }
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!nextComp) return;
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(nextComp.dateStart + "T08:00:00").getTime();
      const diff = target - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextComp]);

  // Load data after login
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [compRes, rangeRes, rankRes] = await Promise.allSettled([
        fetch("/api/competitions").then((r) => r.json()),
        fetch("/api/ranges").then((r) => r.json()),
        fetch("/api/rankings").then((r) => r.json()),
      ]);

      if (compRes.status === "fulfilled" && compRes.value.competitions) {
        setCompetitions(compRes.value.competitions);
      }
      if (rangeRes.status === "fulfilled" && rangeRes.value.ranges) {
        setRanges(rangeRes.value.ranges);
      }
      if (rankRes.status === "fulfilled" && !rankRes.value.error) {
        setRankings(rankRes.value);
      }
    } catch (e) {
      console.error("Failed to load data:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) loadData();
  }, [isLoggedIn, loadData]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsLoggedIn(true);
        setUserEmail(data.email);
        if (data.userName) setUserName(data.userName);
      } else {
        setLoginError(data.error || "Eroare la autentificare");
      }
    } catch {
      setLoginError("Eroare de conexiune. Incercati din nou.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setIsLoggedIn(false);
    setUserEmail("");
    setUserName("");
    setSelectedPlayerId(null);
    setPlayerHistory(null);
    setNameSearch("");
    setCompetitions(COMPETITIONS_2026.map((c) => ({ ...c, status: getCompetitionStatus(c) })));
    setRanges(SHOOTING_RANGES);
    setRankings({ superCupa: [], general: [] });
  };

  // Load competition result
  const loadCompetitionResult = async (id: number) => {
    setSelectedCompetition(id);
    setActiveTab("rezultate");
    setCompetitionResult(null);

    try {
      const res = await fetch(`/api/competition/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCompetitionResult(data);
      }
    } catch (e) {
      console.error("Failed to load competition result:", e);
    }
  };

  // Show auth check loading
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="text-center">
          <TargetIcon className="w-16 h-16 text-gold mx-auto animate-pulse" />
          <p className="text-white mt-4 font-mono text-sm">Se incarca...</p>
        </div>
      </div>
    );
  }

  /* ───────────── LOGIN PAGE ───────────── */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy-light to-navy p-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-4">
              <TargetIcon className="w-10 h-10 text-gold" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              FITASC <span className="text-gold">Sporting</span>
            </h1>
            <p className="text-steel-light mt-2 text-sm">
              Clasamente si competitii de tir sportiv
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-steel-light mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-steel focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  placeholder="adresa@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-steel-light mb-2">
                  Parola
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-steel focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  placeholder="Parola ta"
                  required
                  autoComplete="current-password"
                />
              </div>

              {loginError && (
                <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-danger text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-gold/25"
              >
                {loginLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Se autentifica...
                  </span>
                ) : (
                  "Autentificare"
                )}
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs text-steel text-center">
                Foloseste contul tau de pe{" "}
                <a
                  href="https://fitascsporting.ro/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  fitascsporting.ro
                </a>
              </p>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-steel text-xs mt-6">
            Sporting Romania &middot; FRTS
          </p>
        </div>
      </div>
    );
  }

  /* ───────────── MAIN DASHBOARD ───────────── */
  const filteredCompetitions = competitions.filter((c) => {
    if (disciplineFilter !== "all" && c.discipline !== disciplineFilter) return false;
    return true;
  });

  const upcomingComps = filteredCompetitions
    .filter((c) => getCompetitionStatus(c) === "upcoming")
    .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());

  const completedComps = filteredCompetitions
    .filter((c) => getCompetitionStatus(c) === "completed")
    .sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime());

  // Find logged-in user in player database - dynamic based on who is logged in
  const currentPlayer = (() => {
    // If user manually selected a player from search
    if (selectedPlayerId) {
      return ALL_PLAYERS.find(p => p.PersonId === selectedPlayerId) || null;
    }
    // Try matching by name from auth (dashboard scrape)
    if (userName) {
      const byName = ALL_PLAYERS.find(
        p => p.Person.toLowerCase() === userName.toLowerCase()
      );
      if (byName) return byName;
      // Try partial match (last name first name order can differ)
      const parts = userName.toLowerCase().split(/\s+/);
      if (parts.length >= 2) {
        const partial = ALL_PLAYERS.find(p => {
          const pParts = p.Person.toLowerCase().split(/\s+/);
          return parts.every(part => pParts.some(pp => pp.includes(part)));
        });
        if (partial) return partial;
      }
    }
    return null;
  })();

  const teammates = currentPlayer ? getTeammates(currentPlayer.Team) : [];
  const categoryCounts = getCategoryCount();

  // Name search results for profile linking
  const searchResults = nameSearch.length >= 2
    ? ALL_PLAYERS.filter(p =>
        p.Person.toLowerCase().includes(nameSearch.toLowerCase())
      ).slice(0, 10)
    : [];

  // Load player history when currentPlayer changes
  useEffect(() => {
    if (!currentPlayer || !isLoggedIn) {
      setPlayerHistory(null);
      return;
    }
    setHistoryLoading(true);
    fetch(`/api/history?personId=${currentPlayer.PersonId}`)
      .then(r => r.json())
      .then(data => {
        if (!data.error) setPlayerHistory(data);
      })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, [currentPlayer?.PersonId, isLoggedIn]);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "profil", label: "Profilul Meu", icon: <UserIcon className="w-4 h-4" /> },
    { id: "competitii", label: "Competitii", icon: <CalendarIcon className="w-4 h-4" /> },
    { id: "clasamente", label: "Clasamente", icon: <TrophyIcon className="w-4 h-4" /> },
    { id: "rezultate", label: "Rezultate", icon: <TargetIcon className="w-4 h-4" /> },
    { id: "poligoane", label: "Poligoane", icon: <MapPinIcon className="w-4 h-4" /> },
    { id: "regulamente", label: "Info", icon: <LinkIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── HEADER ── */}
      <header className="bg-navy text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TargetIcon className="w-7 h-7 text-gold" />
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">
                FITASC <span className="text-gold">Sporting</span>
              </h1>
              <p className="text-[10px] text-steel-light font-mono uppercase tracking-wider">
                Romania
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-steel-light hidden sm:inline">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Deconectare"
            >
              <LogoutIcon className="w-5 h-5 text-steel-light" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO: NEXT COMPETITION ── */}
      {nextComp && (
        <section className="bg-gradient-to-r from-navy via-navy-light to-navy text-white">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <p className="text-xs uppercase tracking-widest text-gold font-mono mb-3">
              Urmatoarea Competitie
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">{nextComp.name}</h2>
            <p className="text-steel-light mb-1">
              {nextComp.discipline} &middot; {nextComp.location}, {nextComp.range}
            </p>
            <p className="text-sm text-steel-light mb-6">
              {formatDate(nextComp.dateStart)} - {formatDate(nextComp.dateEnd)}
            </p>

            {/* Countdown */}
            <div className="flex gap-3 sm:gap-4">
              {[
                { val: countdown.days, label: "Zile" },
                { val: countdown.hours, label: "Ore" },
                { val: countdown.minutes, label: "Min" },
                { val: countdown.seconds, label: "Sec" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center min-w-[68px]"
                >
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-gold">
                    {String(item.val).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-steel-light mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick info */}
            <div className="flex flex-wrap gap-4 mt-6">
              {nextComp.mapUrl && (
                <a
                  href={nextComp.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
                >
                  <MapPinIcon className="w-4 h-4" />
                  Vezi pe harta
                </a>
              )}
              {nextComp.phone && (
                <a
                  href={`tel:${nextComp.phone}`}
                  className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
                >
                  <PhoneIcon className="w-4 h-4" />
                  {nextComp.phone}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── TAB NAVIGATION ── */}
      <nav className="bg-white border-b border-border sticky top-[52px] z-40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-gold text-navy"
                    : "border-transparent text-muted hover:text-navy hover:border-steel-light"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading && <LoadingSkeleton />}

        {/* ── TAB: PROFILUL MEU ── */}
        {!loading && activeTab === "profil" && currentPlayer && (
          <div className="animate-fade-in space-y-6">
            {/* Profile Card */}
            <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-2xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{currentPlayer.Person}</h3>
                  <p className="text-steel-light text-sm mt-1">{userEmail}</p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gold/20 text-gold">
                      Categoria {currentPlayer.Category || "N/A"}
                    </span>
                    {currentPlayer.Team && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white">
                        {currentPlayer.Team}
                      </span>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-white/10 text-steel-light">
                      ID: {currentPlayer.PersonId}
                    </span>
                  </div>
                  {/* Change profile link */}
                  <button
                    onClick={() => {
                      setSelectedPlayerId(null);
                      setPlayerHistory(null);
                      setNameSearch("");
                    }}
                    className="mt-3 text-xs text-steel-light hover:text-gold transition-colors underline"
                  >
                    Nu esti tu? Schimba profilul
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <div className="text-2xl font-bold font-mono text-gold-dark">
                  {playerHistory?.competitions.filter(c => c.hasScore).reduce((best, c) => Math.max(best, c.percentage || 0), 0).toFixed(1) || currentPlayer.Procent.toFixed(1) || "0.0"}%
                </div>
                <div className="text-xs text-muted mt-1">Cel mai bun procent</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <div className="text-2xl font-bold font-mono text-navy">
                  {playerHistory?.competitions.length || 0}
                </div>
                <div className="text-xs text-muted mt-1">Competitii inscris</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <div className="text-2xl font-bold font-mono text-success">
                  {(() => {
                    if (!playerHistory) return "—";
                    let best = 0;
                    for (const c of playerHistory.competitions) {
                      if (c.rounds) {
                        for (const r of c.rounds) {
                          const pct = (r / 16) * 100;
                          if (pct > best) best = pct;
                        }
                      }
                    }
                    return best > 0 ? `${best.toFixed(1)}%` : "—";
                  })()}
                </div>
                <div className="text-xs text-muted mt-1">Record pe runda</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <div className="text-2xl font-bold font-mono text-navy">{teammates.length}</div>
                <div className="text-xs text-muted mt-1">Colegi Club</div>
              </div>
            </div>

            {/* Season Status */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h4 className="font-bold text-navy mb-3 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gold" />
                Sezon 2026
              </h4>
              <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                <p className="text-sm text-navy font-medium">Sezonul 2026 tocmai a inceput</p>
                <p className="text-xs text-muted mt-1">
                  Rezultatele si clasamentele se vor actualiza pe masura ce competitiile au loc.
                  Prima competitie: {nextComp ? formatDate(nextComp.dateStart) : "TBD"}.
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted">
                  Competitii programate: <strong className="text-navy">{competitions.length}</strong>
                </p>
                <p className="text-sm text-muted">
                  Discipline: <strong className="text-navy">Fitasc Sporting + Compak Sporting</strong>
                </p>
                <p className="text-sm text-muted">
                  Finala necesita minim: <strong className="text-navy">3 participari</strong>
                </p>
              </div>
            </div>

            {/* Teammates */}
            {teammates.length > 1 && (
              <div className="bg-card rounded-2xl border border-border p-5">
                <h4 className="font-bold text-navy mb-3 flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-gold" />
                  Colegi {currentPlayer.Team} ({teammates.length})
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {teammates.map((t) => (
                    <div
                      key={t.PersonId}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        t.PersonId === currentPlayer.PersonId
                          ? "border-gold/30 bg-gold/5"
                          : "border-border"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        t.PersonId === currentPlayer.PersonId
                          ? "bg-gold/20 text-gold-dark"
                          : "bg-navy/5 text-navy"
                      }`}>
                        {t.Category || "?"}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          t.PersonId === currentPlayer.PersonId ? "text-gold-dark" : "text-navy"
                        }`}>
                          {t.Person}
                          {t.PersonId === currentPlayer.PersonId && " (Tu)"}
                        </p>
                        <p className="text-xs text-muted">
                          Cat. {t.Category || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historical Results - Dynamic */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h4 className="font-bold text-navy mb-4 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-gold" />
                Istoric Competitii
              </h4>

              {historyLoading && (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton h-16 w-full rounded-lg" />
                  ))}
                  <p className="text-xs text-muted text-center mt-2">Se cauta rezultatele tale in competitiile anterioare...</p>
                </div>
              )}

              {!historyLoading && playerHistory && playerHistory.competitions.length > 0 && (
                <>
                  {/* Show scored competitions first with detail cards */}
                  {playerHistory.competitions
                    .filter(c => c.hasScore)
                    .map(comp => {
                      const bestRound = comp.rounds ? Math.max(...comp.rounds) : 0;
                      const worstRound = comp.rounds ? Math.min(...comp.rounds) : 0;
                      return (
                        <div key={comp.id} className="border border-gold/30 rounded-xl overflow-hidden mb-4">
                          <div className="bg-gradient-to-r from-gold/10 to-gold/5 px-4 py-3 border-b border-gold/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-bold text-navy">{comp.name}</h5>
                                <p className="text-xs text-muted">{comp.location}</p>
                              </div>
                              <div className="text-right">
                                {comp.position && comp.totalCompetitors && (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gold/20 text-gold-dark">
                                    Loc {comp.position} / {comp.totalCompetitors}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="p-4">
                            {/* Score summary */}
                            <div className="flex items-center gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-3xl font-bold font-mono text-navy">{comp.score}</div>
                                <div className="text-[10px] text-muted uppercase">Total</div>
                              </div>
                              <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full"
                                  style={{ width: `${comp.percentage || 0}%` }}
                                />
                              </div>
                              <div className="text-center">
                                <div className="text-xl font-bold font-mono text-gold-dark">
                                  {(comp.percentage || 0).toFixed(1)}%
                                </div>
                                <div className="text-[10px] text-muted uppercase">Procent</div>
                              </div>
                            </div>

                            {/* Round-by-round scores */}
                            {comp.rounds && comp.rounds.length > 0 && (
                              <div className="overflow-x-auto -mx-1">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="text-xs text-muted">
                                      {comp.rounds.map((_, i) => (
                                        <th key={i} className="px-2 py-1.5 text-center font-medium">M{i + 1}</th>
                                      ))}
                                      {comp.total1 !== undefined && (
                                        <th className="px-2 py-1.5 text-center font-medium bg-navy/5 rounded-t">T1</th>
                                      )}
                                      {comp.total2 !== undefined && (
                                        <th className="px-2 py-1.5 text-center font-medium bg-navy/5 rounded-t">T2</th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      {comp.rounds.map((r, i) => (
                                        <td
                                          key={i}
                                          className={`px-2 py-2 text-center font-mono font-bold ${
                                            r === bestRound ? "text-success" : r === worstRound ? "text-danger" : "text-navy"
                                          }`}
                                        >
                                          {r}
                                        </td>
                                      ))}
                                      {comp.total1 !== undefined && (
                                        <td className="px-2 py-2 text-center font-mono font-bold bg-navy/5 text-navy">{comp.total1}</td>
                                      )}
                                      {comp.total2 !== undefined && (
                                        <td className="px-2 py-2 text-center font-mono font-bold bg-navy/5 text-navy">{comp.total2}</td>
                                      )}
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* Performance insights */}
                            {comp.rounds && comp.rounds.length > 0 && (
                              <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                                  <p className="text-xs text-success font-medium">Cea mai buna runda</p>
                                  <p className="text-sm font-bold text-navy">
                                    {bestRound}/16 ({((bestRound / 16) * 100).toFixed(1)}%)
                                  </p>
                                </div>
                                <div className="bg-danger/5 border border-danger/20 rounded-lg p-3">
                                  <p className="text-xs text-danger font-medium">De imbunatatit</p>
                                  <p className="text-sm font-bold text-navy">
                                    {worstRound}/16 ({((worstRound / 16) * 100).toFixed(1)}%)
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {/* All competitions list */}
                  <h5 className="font-semibold text-navy text-sm mb-3">
                    Competitii inscris ({playerHistory.competitions.length} total)
                  </h5>
                  <div className="space-y-2">
                    {playerHistory.competitions.map((comp) => (
                      <div
                        key={comp.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg border ${
                          comp.hasScore ? "border-gold/30 bg-gold/5" : "border-border"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted w-6">#{comp.id}</span>
                          <div>
                            <p className="text-sm font-medium text-navy">{comp.name}</p>
                            <p className="text-xs text-muted">{comp.location}</p>
                          </div>
                        </div>
                        {comp.hasScore ? (
                          <div className="text-right">
                            <p className="text-sm font-bold font-mono text-gold-dark">
                              {comp.score} ({(comp.percentage || 0).toFixed(1)}%)
                            </p>
                            {comp.position && comp.totalCompetitors && (
                              <p className="text-xs text-muted">Loc {comp.position}/{comp.totalCompetitors}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-steel px-2 py-0.5 rounded-full bg-steel/5">Inscris</span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!historyLoading && (!playerHistory || playerHistory.competitions.length === 0) && (
                <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-center">
                  <p className="text-sm text-navy font-medium">Nu s-au gasit rezultate istorice</p>
                  <p className="text-xs text-muted mt-1">
                    Rezultatele vor aparea pe masura ce participi la competitii.
                  </p>
                </div>
              )}
            </div>

            {/* Upcoming competitions */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h4 className="font-bold text-navy mb-3 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gold" />
                Urmatoarele Competitii
              </h4>
              <div className="space-y-3">
                {competitions
                  .filter((c) => getCompetitionStatus(c) === "upcoming")
                  .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime())
                  .slice(0, 4)
                  .map((comp) => (
                    <div key={comp.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                      <div>
                        <p className="text-sm font-medium text-navy">{comp.name}</p>
                        <p className="text-xs text-muted">
                          {comp.discipline} &middot; {comp.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-navy">{formatDateShort(comp.dateStart)}</p>
                        <p className="text-xs text-muted">in {getDaysUntil(comp.dateStart)} zile</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === "profil" && !currentPlayer && (
          <div className="animate-fade-in space-y-6">
            {/* Profile linking - user needs to find themselves */}
            <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-2xl p-6 text-white text-center">
              <UserIcon className="w-12 h-12 text-gold mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Gaseste-ti profilul</h3>
              <p className="text-steel-light text-sm mb-4">
                Cauta-ti numele in baza de date cu {ALL_PLAYERS.length} sportivi inregistrati
              </p>
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-steel focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  placeholder="Cauta dupa nume (ex: Popescu Ion)..."
                />
              </div>
            </div>

            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-navy/5 border-b border-border">
                  <p className="text-sm font-medium text-navy">
                    {searchResults.length} rezultat{searchResults.length > 1 ? "e" : ""} gasit{searchResults.length > 1 ? "e" : ""}
                  </p>
                </div>
                <div className="divide-y divide-border">
                  {searchResults.map((player) => (
                    <button
                      key={player.PersonId}
                      onClick={() => {
                        setSelectedPlayerId(player.PersonId);
                        setNameSearch("");
                      }}
                      className="w-full flex items-center justify-between p-4 hover:bg-gold/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-navy">{player.Category || "?"}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-navy">{player.Person}</p>
                          <p className="text-xs text-muted">
                            {player.Team || "Fara echipa"} &middot; ID: {player.PersonId}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gold font-medium">Selecteaza</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {nameSearch.length >= 2 && searchResults.length === 0 && (
              <div className="bg-card rounded-2xl border border-border p-6 text-center">
                <p className="text-muted text-sm">Niciun sportiv gasit pentru &ldquo;{nameSearch}&rdquo;</p>
                <p className="text-xs text-steel mt-1">Incearca cu alt nume sau verifica ortografia</p>
              </div>
            )}

            {nameSearch.length < 2 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <p className="text-muted text-sm text-center">
                  Scrie cel putin 2 caractere pentru a cauta.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-navy/5">
                    <div className="text-2xl font-bold text-navy">{ALL_PLAYERS.length}</div>
                    <div className="text-xs text-muted">Sportivi</div>
                  </div>
                  <div className="p-3 rounded-xl bg-navy/5">
                    <div className="text-2xl font-bold text-navy">{CATEGORIES.length}</div>
                    <div className="text-xs text-muted">Categorii</div>
                  </div>
                  <div className="p-3 rounded-xl bg-navy/5">
                    <div className="text-2xl font-bold text-navy">{competitions.length}</div>
                    <div className="text-xs text-muted">Competitii 2026</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: COMPETITII ── */}
        {!loading && activeTab === "competitii" && (
          <div className="animate-fade-in">
            {/* Discipline filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {["all", ...DISCIPLINES].map((d) => (
                <button
                  key={d}
                  onClick={() => setDisciplineFilter(d)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    disciplineFilter === d
                      ? "bg-navy text-gold shadow-md"
                      : "bg-white text-muted border border-border hover:border-navy/30"
                  }`}
                >
                  {d === "all" ? "Toate" : d}
                </button>
              ))}
            </div>

            {/* Upcoming */}
            {upcomingComps.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-gold" />
                  Competitii viitoare ({upcomingComps.length})
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {upcomingComps.map((comp) => {
                    const days = getDaysUntil(comp.dateStart);
                    return (
                      <div
                        key={comp.id}
                        className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow animate-slide-up"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold-dark">
                            {comp.discipline}
                          </span>
                          <span className="text-xs font-mono text-muted">
                            {days > 0 ? `in ${days} zile` : "Azi!"}
                          </span>
                        </div>
                        <h4 className="font-bold text-navy mb-1">{comp.name}</h4>
                        <p className="text-sm text-muted mb-3">
                          {comp.location}, {comp.range}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-navy">
                            {formatDateShort(comp.dateStart)} - {formatDateShort(comp.dateEnd)}
                          </span>
                          {comp.mapUrl && (
                            <a
                              href={comp.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gold hover:text-gold-dark transition-colors flex items-center gap-1"
                            >
                              <MapPinIcon className="w-3.5 h-3.5" />
                              Harta
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed */}
            {completedComps.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-steel" />
                  Competitii finalizate ({completedComps.length})
                </h3>
                <div className="space-y-3">
                  {completedComps.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => loadCompetitionResult(comp.id)}
                      className="w-full bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-gold/30 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-muted font-mono">{comp.discipline}</span>
                          <h4 className="font-semibold text-navy">{comp.name}</h4>
                          <p className="text-sm text-muted">
                            {comp.location} &middot; {formatDateShort(comp.dateStart)}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredCompetitions.length === 0 && (
              <div className="text-center py-16">
                <CalendarIcon className="w-12 h-12 text-steel-light mx-auto mb-3" />
                <p className="text-muted">Nicio competitie gasita pentru filtrul selectat.</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: CLASAMENTE ── */}
        {!loading && activeTab === "clasamente" && (
          <div className="animate-fade-in">
            {/* Summary bar */}
            <div className="bg-card rounded-2xl border border-border p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-gold" />
                <span className="font-bold text-navy">{ALL_PLAYERS.length} sportivi inregistrati</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(categoryCounts)
                  .filter(([cat]) => cat !== "Necategorizat")
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([cat, count]) => (
                    <span key={cat} className="text-xs px-2 py-1 rounded-full bg-navy/5 text-navy font-mono">
                      {cat}: {count}
                    </span>
                  ))}
              </div>
            </div>

            {/* Super Cupa Info */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-gold" />
                Super Cupa Romaniei 2026
              </h3>
              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-3">
                  <p className="text-sm text-navy font-medium">Sezonul 2026 tocmai a inceput - clasamentul Super Cupa se va actualiza dupa prima competitie.</p>
                </div>
                <p className="text-sm font-mono text-navy bg-navy/5 px-3 py-2 rounded-lg">
                  Puncte: 1=25p, 2=18p, 3=15p, 4=12p, 5=10p, 6=8p, 7=6p, 8=4p, 9=2p, 10=1p
                </p>
                <p className="text-xs text-steel mt-2">Doar sportivi romani &middot; Premierea la Grand Prix Romania</p>
              </div>
            </div>

            {/* Player Roster by Category */}
            <div>
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <TargetIcon className="w-5 h-5 text-navy" />
                Sportivi pe Categorii
              </h3>

              {/* Category filter */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {["all", ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat as PlayerCategory | "all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      categoryFilter === cat
                        ? "bg-navy text-gold"
                        : "bg-white text-muted border border-border hover:border-navy/30"
                    }`}
                  >
                    {cat === "all" ? `Toate (${ALL_PLAYERS.length})` : `${CATEGORY_LABELS[cat] || cat} (${categoryCounts[cat] || 0})`}
                  </button>
                ))}
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-navy text-white">
                        <th className="px-4 py-3 text-left font-medium w-12">#</th>
                        <th className="px-4 py-3 text-left font-medium">Sportiv</th>
                        <th className="px-4 py-3 text-left font-medium">Cat.</th>
                        <th className="px-4 py-3 text-left font-medium">Club / Echipa</th>
                        <th className="px-4 py-3 text-center font-medium">Procent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ALL_PLAYERS
                        .filter((p) => categoryFilter === "all" || p.Category === categoryFilter)
                        .map((player, idx) => {
                          const isCurrentUser = currentPlayer && player.PersonId === currentPlayer.PersonId;
                          return (
                            <tr
                              key={player.PersonId}
                              className={`border-b border-border table-row-hover ${
                                isCurrentUser ? "bg-gold/5" : ""
                              }`}
                            >
                              <td className="px-4 py-2.5 text-muted font-mono text-xs">{idx + 1}</td>
                              <td className="px-4 py-2.5 font-medium whitespace-nowrap">
                                {player.Person}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs text-gold font-bold">(Tu)</span>
                                )}
                              </td>
                              <td className="px-4 py-2.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-navy/5 text-navy font-medium">
                                  {player.Category || "N/A"}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-muted">{player.Team || "-"}</td>
                              <td className="px-4 py-2.5 text-center font-mono text-xs">
                                {player.Procent > 0 ? `${player.Procent}%` : "-"}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: REZULTATE ── */}
        {!loading && activeTab === "rezultate" && (
          <div className="animate-fade-in">
            {selectedCompetition && competitionResult ? (
              <div>
                <button
                  onClick={() => {
                    setSelectedCompetition(null);
                    setCompetitionResult(null);
                    setActiveTab("competitii");
                  }}
                  className="mb-4 text-sm text-muted hover:text-navy flex items-center gap-1 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Inapoi la competitii
                </button>

                <h3 className="text-xl font-bold text-navy mb-1">
                  {competitionResult.competition.name}
                </h3>
                <p className="text-sm text-muted mb-6">
                  {competitionResult.competition.discipline} &middot;{" "}
                  {competitionResult.competition.location}
                </p>

                {competitionResult.categories.length > 0 ? (
                  competitionResult.categories.map((cat) => (
                    <div key={cat.category} className="mb-8">
                      <h4 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gold/10 text-gold-dark">
                          {cat.category}
                        </span>
                        <span className="text-sm text-muted font-normal">
                          ({cat.scores.length} sportivi)
                        </span>
                      </h4>

                      <div className="bg-card rounded-2xl border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-navy text-white">
                                <th className="px-3 py-3 text-left font-medium">Loc</th>
                                <th className="px-3 py-3 text-left font-medium">Sportiv</th>
                                {cat.scores[0]?.rounds.map((_, i) => (
                                  <th key={i} className="px-3 py-3 text-center font-medium">
                                    R{i + 1}
                                  </th>
                                ))}
                                <th className="px-3 py-3 text-center font-medium">Total</th>
                                <th className="px-3 py-3 text-center font-medium">%</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cat.scores.map((score) => (
                                <tr key={score.position} className="border-b border-border table-row-hover">
                                  <td className="px-3 py-3 font-bold text-navy">
                                    {score.position <= 3 ? (
                                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                        score.position === 1 ? "bg-gold/20 text-gold-dark" :
                                        score.position === 2 ? "bg-steel-light/30 text-steel-dark" :
                                        "bg-orange-100 text-orange-700"
                                      }`}>
                                        {score.position}
                                      </span>
                                    ) : score.position}
                                  </td>
                                  <td className="px-3 py-3 font-medium whitespace-nowrap">
                                    {score.player.name}
                                    {score.player.club && (
                                      <span className="block text-xs text-muted">{score.player.club}</span>
                                    )}
                                  </td>
                                  {score.rounds.map((r, i) => (
                                    <td key={i} className="px-3 py-3 text-center font-mono">
                                      {r}
                                    </td>
                                  ))}
                                  <td className="px-3 py-3 text-center font-bold font-mono text-navy">
                                    {score.total}
                                  </td>
                                  <td className="px-3 py-3 text-center">
                                    <span className={`font-mono text-xs font-medium px-2 py-0.5 rounded-full ${
                                      score.percentage >= 80 ? "bg-success/10 text-success" :
                                      score.percentage >= 60 ? "bg-gold/10 text-gold-dark" :
                                      "bg-danger/10 text-danger"
                                    }`}>
                                      {score.percentage.toFixed(1)}%
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-card rounded-2xl border border-border p-8 text-center">
                    <TargetIcon className="w-10 h-10 text-steel-light mx-auto mb-3" />
                    <p className="text-muted">Rezultatele pentru aceasta competitie nu sunt disponibile inca.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <TargetIcon className="w-12 h-12 text-steel-light mx-auto mb-3" />
                <p className="text-muted mb-2">Selecteaza o competitie pentru a vedea rezultatele</p>
                <button
                  onClick={() => setActiveTab("competitii")}
                  className="text-gold hover:text-gold-dark text-sm font-medium transition-colors"
                >
                  Vezi competitiile
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: POLIGOANE ── */}
        {!loading && activeTab === "poligoane" && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-gold" />
              Poligoane de Tir
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {ranges.map((range, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow animate-slide-up"
                >
                  <h4 className="font-bold text-navy mb-2">{range.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-muted">
                      <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{range.location}{range.address ? `, ${range.address}` : ""}</span>
                    </div>
                    {range.phone && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-muted shrink-0" />
                        <a href={`tel:${range.phone}`} className="text-gold hover:text-gold-dark transition-colors">
                          {range.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-steel">
                      <span>{range.country}</span>
                    </div>
                  </div>
                  {range.mapUrl && (
                    <a
                      href={range.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold-dark transition-colors"
                    >
                      <MapPinIcon className="w-4 h-4" />
                      Deschide in Google Maps
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: REGULAMENTE / INFO ── */}
        {!loading && activeTab === "regulamente" && (
          <div className="animate-fade-in space-y-8">
            {/* Regulamente */}
            <div>
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-gold" />
                Regulamente
              </h3>
              <div className="space-y-3">
                {REGULATIONS.map((reg, i) => (
                  <a
                    key={i}
                    href={reg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-gold/30 transition-all"
                  >
                    <h4 className="font-semibold text-navy">{reg.title}</h4>
                    <p className="text-sm text-muted mt-1">{reg.description}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Reguli importante */}
            <div>
              <h3 className="text-lg font-bold text-navy mb-4">Reguli Importante</h3>
              <div className="bg-card rounded-2xl border border-border p-5 space-y-5">
                <div>
                  <h4 className="font-semibold text-navy mb-2">Inscrieri</h4>
                  <ul className="space-y-1.5 text-sm text-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">&#8226;</span>
                      Termen: <strong className="text-navy">{RULES_SUMMARY.enrollment.deadline}</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">&#8226;</span>
                      Taxa inscriere: <strong className="text-navy">{RULES_SUMMARY.enrollment.entryFee}</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">&#8226;</span>
                      Anulare: {RULES_SUMMARY.enrollment.cancellation}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">&#8226;</span>
                      Inscriere tarzie: {RULES_SUMMARY.enrollment.lateFee}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">&#8226;</span>
                      Taxa contestatie: {RULES_SUMMARY.enrollment.protestFee}
                    </li>
                  </ul>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-navy mb-2">Super Cupa</h4>
                  <p className="text-sm text-muted mb-2">{RULES_SUMMARY.superCupa.description}</p>
                  <p className="text-sm font-mono text-navy bg-navy/5 px-3 py-2 rounded-lg">
                    {RULES_SUMMARY.superCupa.points}
                  </p>
                  <p className="text-xs text-steel mt-2">{RULES_SUMMARY.superCupa.eligibility} &middot; {RULES_SUMMARY.superCupa.award}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-navy mb-2">Clasament</h4>
                  <p className="text-sm text-muted">{RULES_SUMMARY.ranking.description}</p>
                  <p className="text-xs text-steel mt-1">Se folosesc cele mai bune {RULES_SUMMARY.ranking.bestResults}</p>
                </div>
              </div>
            </div>

            {/* Linkuri utile */}
            <div>
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-gold" />
                Linkuri Utile
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {USEFUL_LINKS.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-gold/30 transition-all flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                      <LinkIcon className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-sm font-medium text-navy">{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-navy text-white mt-12">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TargetIcon className="w-5 h-5 text-gold" />
              <span className="text-sm font-bold">FITASC Sporting Romania</span>
            </div>
            <div className="text-xs text-steel-light text-center sm:text-right">
              <p>FRTS, Str. Vadul Moldovei, Nr. 14, Sector 1, 014033 Bucuresti</p>
              <p className="mt-1">
                Date oficiale:{" "}
                <a
                  href="https://fitascsporting.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  fitascsporting.ro
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
