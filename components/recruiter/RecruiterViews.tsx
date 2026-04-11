"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  BarChart3,
  BookmarkPlus,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  LineChart,
  MessageSquare,
  RefreshCw,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import { defaultRecruiterId } from "@/data/recruiterSeed";
import type {
  AnalyticsPayload,
  ApiResponse,
  CandidateFilters,
  CandidateRecord,
  DiscoverPayload,
  InterviewRecord,
  MessageRecord,
  OfferRecord,
  ShortlistPayload,
} from "@/lib/recruiter-types";

type MetaState = {
  message?: string;
  fallbackUsed?: boolean;
  source?: "database" | "fallback";
};

async function fetchApi<T>(url: string, init?: RequestInit) {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ApiResponse<T>;
  } catch {
    return null;
  }
}

function mergeMeta(previous: MetaState, next?: MetaState) {
  return {
    message: next?.message || previous.message,
    fallbackUsed: next?.fallbackUsed ?? previous.fallbackUsed,
    source: next?.source ?? previous.source,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getDaysUntil(value: string) {
  return Math.ceil((new Date(value).getTime() - Date.now()) / 86400000);
}

function Card({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[#b8baff]">
            {icon}
          </div>
          <h2 className="font-heading text-xl font-bold text-white">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function MetaBanner({ meta }: { meta: MetaState }) {
  if (!meta.message && meta.fallbackUsed === undefined) {
    return null;
  }

  const tone = meta.fallbackUsed
    ? "border-[#f0c9b9]/30 bg-[#f0c9b9]/10 text-[#ffe7d6]"
    : "border-[#b9f0d7]/25 bg-[#b9f0d7]/10 text-[#b9f0d7]";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${tone}`}>
      <div className="flex items-center gap-2 font-semibold">
        {meta.fallbackUsed ? <Clock3 size={16} /> : <CheckCircle2 size={16} />}
        <span>{meta.fallbackUsed ? "Fallback mode active" : "Live data connected"}</span>
      </div>
      <p className="mt-1 text-sm/6 text-zinc-200">{meta.message || "Recruiter system ready."}</p>
    </div>
  );
}

function KpiCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-zinc-400">{helper}</p>
    </div>
  );
}

function SimpleBars({
  data,
  accent = "from-[#6666ff] to-[#b9f0d7]",
}: {
  data: Array<{ label: string; value: number }>;
  accent?: string;
}) {
  const maxValue = Math.max(...data.map((entry) => entry.value), 1);

  return (
    <div className="space-y-3">
      {data.map((entry) => (
        <div key={entry.label} className="space-y-1">
          <div className="flex items-center justify-between text-sm text-zinc-300">
            <span>{entry.label}</span>
            <span className="font-semibold text-white">{entry.value}</span>
          </div>
          <div className="h-3 rounded-full bg-white/5">
            <div
              className={`h-3 rounded-full bg-gradient-to-r ${accent}`}
              style={{ width: `${(entry.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CandidatePill({ active, children }: { active?: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        active
          ? "border-[#b9f0d7]/30 bg-[#b9f0d7]/10 text-[#b9f0d7]"
          : "border-white/10 bg-white/5 text-zinc-300"
      }`}
    >
      {children}
    </span>
  );
}

export function RecruiterDashboardView() {
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [shortlist, setShortlist] = useState<ShortlistPayload | null>(null);
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [meta, setMeta] = useState<MetaState>({});
  const [seedMessage, setSeedMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    const [analyticsRes, candidatesRes, shortlistRes, offersRes, interviewsRes] = await Promise.all([
      fetchApi<AnalyticsPayload>("/api/recruiter/analytics"),
      fetchApi<CandidateRecord[]>("/api/recruiter/candidates"),
      fetchApi<ShortlistPayload>(`/api/recruiter/shortlist?recruiterId=${defaultRecruiterId}`),
      fetchApi<OfferRecord[]>("/api/recruiter/offers"),
      fetchApi<InterviewRecord[]>(`/api/recruiter/interviews?recruiterId=${defaultRecruiterId}`),
    ]);

    if (analyticsRes) {
      setAnalytics(analyticsRes.data);
      setMeta((current) => mergeMeta(current, analyticsRes.meta));
    }
    if (candidatesRes) {
      setCandidates(candidatesRes.data);
      setMeta((current) => mergeMeta(current, candidatesRes.meta));
    }
    if (shortlistRes) {
      setShortlist(shortlistRes.data);
      setMeta((current) => mergeMeta(current, shortlistRes.meta));
    }
    if (offersRes) {
      setOffers(offersRes.data);
      setMeta((current) => mergeMeta(current, offersRes.meta));
    }
    if (interviewsRes) {
      setInterviews(interviewsRes.data);
      setMeta((current) => mergeMeta(current, interviewsRes.meta));
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  const topCandidates = useMemo(
    () =>
      [...candidates]
        .sort((left, right) => right.portfolioScore + right.dsaScore - (left.portfolioScore + left.dsaScore))
        .slice(0, 5),
    [candidates],
  );

  return (
    <div className="space-y-6">
      <MetaBanner meta={meta} />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-white/10 bg-gradient-to-r from-[#151528] to-[#0c0c16] p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#b8baff]">Recruiter Command Center</p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-white">TechNova Hiring Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">
            Manage candidate discovery, shortlist health, outreach activity, interviews, and offer momentum from one workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              startTransition(async () => {
                const seeded = await fetchApi<{ seeded: boolean; collections: string[] }>(
                  "/api/recruiter/seed",
                  { method: "POST" },
                );
                setSeedMessage(seeded?.meta.message || "Seed request completed.");
                await loadDashboard();
              })
            }
            className="rounded-full border border-[#b9f0d7]/25 bg-[#b9f0d7]/10 px-5 py-3 text-sm font-semibold text-[#b9f0d7]"
          >
            Seed Demo Data
          </button>
          <Link
            href="/recruiter/candidates"
            className="rounded-full bg-[#6666ff] px-5 py-3 text-sm font-semibold text-white"
          >
            Open Candidate Discovery
          </Link>
        </div>
      </div>

      {seedMessage ? <div className="text-sm text-zinc-300">{seedMessage}</div> : null}

      {analytics ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Time to hire" value={`${analytics.kpis.timeToHire} days`} helper="Average from first touch to accepted offer" />
            <KpiCard label="Acceptance rate" value={`${analytics.kpis.offerAcceptanceRate}%`} helper="Accepted offers across the current pipeline" />
            <KpiCard label="Quality score" value={`${analytics.kpis.candidateQualityScore}`} helper="Shortlist-weighted candidate quality average" />
            <KpiCard label="Active candidates" value={`${analytics.kpis.activeCandidates}`} helper="Candidates currently marked available" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
            <Card title="Hiring Analytics" icon={<BarChart3 size={20} />}>
              <div className="grid gap-6 md:grid-cols-2">
                <SimpleBars data={analytics.charts.offersByStatus} />
                <SimpleBars data={analytics.charts.qualityByBranch} accent="from-[#b8baff] to-[#c9e8ff]" />
              </div>
            </Card>

            <Card title="Recruiter Activity" icon={<LineChart size={20} />}>
              <div className="space-y-3">
                {analytics.recruiterActivity.map((entry) => (
                  <div key={`${entry.label}-${entry.timestamp}`} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{entry.label}</p>
                      <span className="text-xs text-zinc-500">{formatDate(entry.timestamp)}</span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-300">{entry.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Card title="Candidate Management" icon={<Users size={20} />}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-zinc-400">
                <tr>
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Branch</th>
                  <th className="pb-3">CGPA</th>
                  <th className="pb-3">DSA</th>
                  <th className="pb-3">Availability</th>
                </tr>
              </thead>
              <tbody>
                {topCandidates.map((candidate) => (
                  <tr key={candidate.id} className="border-t border-white/5">
                    <td className="py-3">
                      <p className="font-semibold text-white">{candidate.name}</p>
                      <p className="text-xs text-zinc-500">{candidate.skills.slice(0, 3).join(", ")}</p>
                    </td>
                    <td className="py-3 text-zinc-300">{candidate.branch}</td>
                    <td className="py-3 text-zinc-300">{candidate.cgpa}</td>
                    <td className="py-3 text-zinc-300">{candidate.dsaScore}</td>
                    <td className="py-3">
                      <CandidatePill active={candidate.availability}>
                        {candidate.availability ? "Available" : "Busy"}
                      </CandidatePill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Offer Monitor" icon={<BriefcaseBusiness size={20} />}>
          <div className="space-y-3">
            {offers.map((offer) => {
              const daysLeft = getDaysUntil(offer.deadline);
              return (
                <div key={offer.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{offer.candidateId}</p>
                    <CandidatePill active={offer.status === "accepted"}>{offer.status}</CandidatePill>
                  </div>
                  <p className="mt-1 text-sm text-zinc-300">{offer.company} | {offer.salary} LPA</p>
                  <p className="mt-2 text-xs text-zinc-500">Deadline: {formatDate(offer.deadline)}</p>
                  {offer.status === "issued" ? (
                    <p className={`mt-2 text-xs font-semibold ${daysLeft <= 3 ? "text-[#f0c9b9]" : "text-[#b9f0d7]"}`}>
                      {daysLeft <= 0 ? "Deadline reached" : `${daysLeft} day(s) remaining`}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Shortlist Snapshot" icon={<BookmarkPlus size={20} />}>
          <div className="space-y-3">
            {(shortlist?.candidates ?? []).map((candidate) => (
              <div key={candidate.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{candidate.name}</p>
                  <CandidatePill active>{candidate.cgpa} CGPA</CandidatePill>
                </div>
                <p className="mt-1 text-sm text-zinc-300">{candidate.headline}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Interview Queue" icon={<CalendarDays size={20} />}>
          <div className="space-y-3">
            {interviews.map((interview) => (
              <div key={interview.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{interview.candidateId}</p>
                  <CandidatePill active={interview.status === "completed"}>
                    {interview.status}
                  </CandidatePill>
                </div>
                <p className="mt-2 text-sm text-zinc-300">{formatDate(interview.date)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function RecruiterCandidatesView() {
  const [jobDescription, setJobDescription] = useState(
    "Hiring a full-stack engineer with React, Node.js, MongoDB, AWS and strong DSA fundamentals for 0-2 years experience.",
  );
  const [filters, setFilters] = useState<CandidateFilters>({
    skills: [],
    minCgpa: 7,
    minDsaScore: 60,
    minPortfolioScore: 60,
    availability: true,
  });
  const [results, setResults] = useState<DiscoverPayload | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [meta, setMeta] = useState<MetaState>({});
  const [saving, setSaving] = useState(false);

  const loadDiscovery = useCallback(async () => {
    const response = await fetchApi<DiscoverPayload>("/api/recruiter/discover", {
      method: "POST",
      body: JSON.stringify({ jobDescription, filters }),
    });
    if (response) {
      setResults(response.data);
      setMeta(response.meta);
    }
  }, [filters, jobDescription]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDiscovery();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDiscovery]);

  const comparison = useMemo(
    () => (results?.candidates ?? []).filter((candidate) => selectedIds.includes(candidate.id)).slice(0, 3),
    [results, selectedIds],
  );

  return (
    <div className="space-y-6">
      <MetaBanner meta={meta} />

      <Card
        title="Candidate Discovery"
        icon={<Search size={20} />}
        action={
          <button
            type="button"
            onClick={() => loadDiscovery()}
            className="rounded-full bg-[#6666ff] px-4 py-2 text-sm font-semibold text-white"
          >
            Refresh Matches
          </button>
        }
      >
        <div className="grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-300">Job description</span>
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                rows={7}
                className="w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => loadDiscovery()}
                className="rounded-full bg-[#b9f0d7] px-5 py-3 text-sm font-semibold text-black"
              >
                Discover Candidates
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0 || saving}
                onClick={() =>
                  startTransition(async () => {
                    setSaving(true);
                    const response = await fetchApi<ShortlistPayload>("/api/recruiter/shortlist", {
                      method: "POST",
                      body: JSON.stringify({
                        recruiterId: defaultRecruiterId,
                        candidateIds: selectedIds,
                      }),
                    });
                    setMeta((current) => mergeMeta(current, response?.meta));
                    setSaving(false);
                  })
                }
                className="rounded-full border border-[#b8baff]/30 bg-[#b8baff]/10 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Save Shortlist
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center gap-2 text-zinc-300">
              <Filter size={16} />
              <p className="font-semibold">Filter System</p>
            </div>
            <div className="grid gap-3">
              <input
                placeholder="Skills comma separated"
                value={filters.skills?.join(", ") ?? ""}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    skills: event.target.value
                      .split(",")
                      .map((entry) => entry.trim())
                      .filter(Boolean),
                  }))
                }
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              />
              <input
                placeholder="Branch"
                value={filters.branch ?? ""}
                onChange={(event) => setFilters((current) => ({ ...current, branch: event.target.value }))}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="number"
                  placeholder="Min CGPA"
                  value={filters.minCgpa ?? ""}
                  onChange={(event) => setFilters((current) => ({ ...current, minCgpa: Number(event.target.value || 0) }))}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                />
                <input
                  type="number"
                  placeholder="Min DSA"
                  value={filters.minDsaScore ?? ""}
                  onChange={(event) => setFilters((current) => ({ ...current, minDsaScore: Number(event.target.value || 0) }))}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                />
                <input
                  type="number"
                  placeholder="Min Portfolio"
                  value={filters.minPortfolioScore ?? ""}
                  onChange={(event) => setFilters((current) => ({ ...current, minPortfolioScore: Number(event.target.value || 0) }))}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                />
              </div>
              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200">
                <span>Only available candidates</span>
                <input
                  type="checkbox"
                  checked={filters.availability ?? false}
                  onChange={(event) => setFilters((current) => ({ ...current, availability: event.target.checked }))}
                />
              </label>
            </div>
          </div>
        </div>
      </Card>

      {results ? (
        <>
          <div className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
            <Card title="Ranked Table View" icon={<Users size={20} />}>
              <div className="mb-3 flex flex-wrap gap-2">
                <CandidatePill active={results.aiUsed}>{results.aiUsed ? "Groq ranking" : "Rule-based ranking"}</CandidatePill>
                {results.insights.requiredSkills.map((skill) => (
                  <CandidatePill key={skill}>{skill}</CandidatePill>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-zinc-400">
                    <tr>
                      <th className="pb-3">Pick</th>
                      <th className="pb-3">Candidate</th>
                      <th className="pb-3">Score</th>
                      <th className="pb-3">CGPA</th>
                      <th className="pb-3">DSA</th>
                      <th className="pb-3">Portfolio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.candidates.map((candidate) => (
                      <tr key={candidate.id} className="border-t border-white/5">
                        <td className="py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(candidate.id)}
                            onChange={(event) =>
                              setSelectedIds((current) =>
                                event.target.checked
                                  ? [...current, candidate.id]
                                  : current.filter((id) => id !== candidate.id),
                              )
                            }
                          />
                        </td>
                        <td className="py-3">
                          <p className="font-semibold text-white">{candidate.name}</p>
                          <p className="text-xs text-zinc-500">{candidate.branch}</p>
                        </td>
                        <td className="py-3 text-[#b9f0d7]">{candidate.score}</td>
                        <td className="py-3 text-zinc-300">{candidate.cgpa}</td>
                        <td className="py-3 text-zinc-300">{candidate.dsaScore}</td>
                        <td className="py-3 text-zinc-300">{candidate.portfolioScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Candidate Cards" icon={<Sparkles size={20} />}>
              <div className="space-y-3">
                {results.candidates.slice(0, 4).map((candidate) => (
                  <div key={candidate.id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{candidate.name}</p>
                        <p className="text-sm text-zinc-400">{candidate.headline}</p>
                      </div>
                      <CandidatePill active>{candidate.score}% match</CandidatePill>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {candidate.matchedSkills.map((skill) => (
                        <CandidatePill key={skill} active>
                          {skill}
                        </CandidatePill>
                      ))}
                    </div>
                    <ul className="mt-3 space-y-1 text-sm text-zinc-300">
                      {candidate.reasons.slice(0, 3).map((reason) => (
                        <li key={reason}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card title="Side-by-Side Comparison" icon={<RefreshCw size={20} />}>
            {comparison.length === 0 ? (
              <p className="text-sm text-zinc-400">Select up to three candidates from the table to compare them side by side.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {comparison.map((candidate) => (
                  <div key={candidate.id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <p className="font-heading text-xl font-bold text-white">{candidate.name}</p>
                    <p className="mt-1 text-sm text-zinc-400">{candidate.branch}</p>
                    <div className="mt-4 space-y-2 text-sm text-zinc-200">
                      <p>Match score: <span className="font-semibold text-[#b9f0d7]">{candidate.score}%</span></p>
                      <p>CGPA: {candidate.cgpa}</p>
                      <p>DSA: {candidate.dsaScore}</p>
                      <p>Portfolio: {candidate.portfolioScore}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {candidate.skills.map((skill) => (
                        <CandidatePill key={skill}>{skill}</CandidatePill>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      ) : null}
    </div>
  );
}

export function RecruiterShortlistView() {
  const [shortlist, setShortlist] = useState<ShortlistPayload | null>(null);
  const [meta, setMeta] = useState<MetaState>({});

  const loadShortlist = useCallback(async () => {
    const response = await fetchApi<ShortlistPayload>(
      `/api/recruiter/shortlist?recruiterId=${defaultRecruiterId}`,
    );
    if (response) {
      setShortlist(response.data);
      setMeta(response.meta);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadShortlist();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadShortlist]);

  return (
    <div className="space-y-6">
      <MetaBanner meta={meta} />

      <Card title="Bookmarked Candidates" icon={<BookmarkPlus size={20} />}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(shortlist?.candidates ?? []).map((candidate) => (
            <div key={candidate.id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-white">{candidate.name}</p>
                <button
                  type="button"
                  onClick={() =>
                    startTransition(async () => {
                      const remaining = (shortlist?.shortlist.candidateIds ?? []).filter((id) => id !== candidate.id);
                      await fetchApi<ShortlistPayload>("/api/recruiter/shortlist", {
                        method: "POST",
                        body: JSON.stringify({ recruiterId: defaultRecruiterId, candidateIds: remaining }),
                      });
                      await loadShortlist();
                    })
                  }
                  className="text-xs text-[#f0c9b9]"
                >
                  Remove
                </button>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{candidate.headline}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white">{candidate.cgpa} CGPA</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white">{candidate.dsaScore} DSA</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white">{candidate.portfolioScore} Port</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Comparison Matrix" icon={<Users size={20} />}>
        {shortlist?.candidates?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-zinc-400">
                <tr>
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Branch</th>
                  <th className="pb-3">Skills</th>
                  <th className="pb-3">Availability</th>
                </tr>
              </thead>
              <tbody>
                {shortlist.candidates.map((candidate) => (
                  <tr key={candidate.id} className="border-t border-white/5">
                    <td className="py-3 font-semibold text-white">{candidate.name}</td>
                    <td className="py-3 text-zinc-300">{candidate.branch}</td>
                    <td className="py-3 text-zinc-300">{candidate.skills.slice(0, 4).join(", ")}</td>
                    <td className="py-3">
                      <CandidatePill active={candidate.availability}>
                        {candidate.availability ? "Available" : "Busy"}
                      </CandidatePill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-zinc-400">No candidates shortlisted yet. Use the discovery page to save a shortlist.</p>
        )}
      </Card>
    </div>
  );
}

export function RecruiterEngagementView() {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [draft, setDraft] = useState("");
  const [scheduleDate, setScheduleDate] = useState("2026-04-18T14:00");
  const [meta, setMeta] = useState<MetaState>({});

  const loadCandidates = useCallback(async () => {
    const response = await fetchApi<CandidateRecord[]>("/api/recruiter/candidates");
    if (response) {
      setCandidates(response.data);
      setSelectedCandidateId((current) => current || response.data[0]?.id || "");
      setMeta((current) => mergeMeta(current, response.meta));
    }
  }, []);

  const loadConversation = useCallback(async (candidateId: string) => {
    const [messagesRes, interviewsRes] = await Promise.all([
      fetchApi<MessageRecord[]>(
        `/api/recruiter/messages?recruiterId=${defaultRecruiterId}&candidateId=${candidateId}`,
      ),
      fetchApi<InterviewRecord[]>(`/api/recruiter/interviews?recruiterId=${defaultRecruiterId}`),
    ]);

    if (messagesRes) {
      setMessages(messagesRes.data);
      setMeta((current) => mergeMeta(current, messagesRes.meta));
    }
    if (interviewsRes) {
      setInterviews(interviewsRes.data.filter((entry) => entry.candidateId === candidateId));
      setMeta((current) => mergeMeta(current, interviewsRes.meta));
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCandidates();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadCandidates]);

  useEffect(() => {
    if (selectedCandidateId) {
      const timer = window.setTimeout(() => {
        void loadConversation(selectedCandidateId);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [loadConversation, selectedCandidateId]);

  const selectedCandidate = candidates.find((candidate) => candidate.id === selectedCandidateId);

  return (
    <div className="space-y-6">
      <MetaBanner meta={meta} />

      <div className="grid gap-6 xl:grid-cols-[0.8fr,1.2fr]">
        <Card title="Candidates" icon={<Users size={20} />}>
          <div className="space-y-3">
            {candidates.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => setSelectedCandidateId(candidate.id)}
                className={`w-full rounded-3xl border p-4 text-left ${
                  selectedCandidateId === candidate.id
                    ? "border-[#b9f0d7]/30 bg-[#b9f0d7]/10"
                    : "border-white/10 bg-black/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{candidate.name}</p>
                  <CandidatePill active={candidate.availability}>
                    {candidate.availability ? "Available" : "Busy"}
                  </CandidatePill>
                </div>
                <p className="mt-1 text-sm text-zinc-400">{candidate.branch}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Messaging + Scheduling" icon={<MessageSquare size={20} />}>
          {selectedCandidate ? (
            <div className="space-y-5">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{selectedCandidate.name}</p>
                    <p className="text-sm text-zinc-400">{selectedCandidate.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      startTransition(async () => {
                        const preview = await fetchApi<{ preview: string }>("/api/recruiter/message", {
                          method: "POST",
                          body: JSON.stringify({
                            receiverId: selectedCandidate.id,
                            candidateName: selectedCandidate.name,
                            role: "Software Engineer",
                            previewOnly: true,
                          }),
                        });
                        setDraft(preview?.data.preview || "");
                        setMeta((current) => mergeMeta(current, preview?.meta));
                      })
                    }
                    className="rounded-full border border-[#b8baff]/30 bg-[#b8baff]/10 px-4 py-2 text-sm font-semibold text-white"
                  >
                    AI Draft
                  </button>
                </div>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={4}
                  className="mt-4 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                />
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      startTransition(async () => {
                        await fetchApi<MessageRecord>("/api/recruiter/message", {
                          method: "POST",
                          body: JSON.stringify({
                            receiverId: selectedCandidate.id,
                            message: draft,
                            candidateName: selectedCandidate.name,
                            role: "Software Engineer",
                          }),
                        });
                        setDraft("");
                        await loadConversation(selectedCandidate.id);
                      })
                    }
                    className="rounded-full bg-[#6666ff] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Send Message
                  </button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="font-semibold text-white">Schedule interview</p>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(event) => setScheduleDate(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      startTransition(async () => {
                        await fetchApi<InterviewRecord>("/api/recruiter/interview", {
                          method: "POST",
                          body: JSON.stringify({
                            candidateId: selectedCandidate.id,
                            recruiterId: defaultRecruiterId,
                            date: new Date(scheduleDate).toISOString(),
                          }),
                        });
                        await loadConversation(selectedCandidate.id);
                      })
                    }
                    className="mt-3 rounded-full bg-[#b9f0d7] px-4 py-2 text-sm font-semibold text-black"
                  >
                    Schedule
                  </button>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="font-semibold text-white">Conversation history</p>
                  <div className="mt-3 space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-white">
                            {message.senderId === defaultRecruiterId ? "Recruiter" : selectedCandidate.name}
                          </p>
                          <span className="text-xs text-zinc-500">{formatDate(message.timestamp)}</span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-300">{message.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="font-semibold text-white">Interview timeline</p>
                    {interviews.map((interview) => (
                      <div key={interview.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-300">
                        {formatDate(interview.date)} | {interview.status}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">Select a candidate to start messaging and interview scheduling.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

export function RecruiterOffersView() {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [candidateId, setCandidateId] = useState("");
  const [salary, setSalary] = useState("15");
  const [deadline, setDeadline] = useState("2026-04-20T18:00");
  const [meta, setMeta] = useState<MetaState>({});

  const loadOffers = useCallback(async () => {
    const [candidatesRes, offersRes] = await Promise.all([
      fetchApi<CandidateRecord[]>("/api/recruiter/candidates"),
      fetchApi<OfferRecord[]>("/api/recruiter/offers"),
    ]);

    if (candidatesRes) {
      setCandidates(candidatesRes.data);
      setCandidateId((current) => current || candidatesRes.data[0]?.id || "");
      setMeta((current) => mergeMeta(current, candidatesRes.meta));
    }
    if (offersRes) {
      setOffers(offersRes.data);
      setMeta((current) => mergeMeta(current, offersRes.meta));
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOffers();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadOffers]);

  return (
    <div className="space-y-6">
      <MetaBanner meta={meta} />

      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <Card title="Issue Offer" icon={<BriefcaseBusiness size={20} />}>
          <div className="space-y-3">
            <select
              value={candidateId}
              onChange={(event) => setCandidateId(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            >
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </option>
              ))}
            </select>
            <input
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
              placeholder="Salary in LPA"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            />
            <input
              type="datetime-local"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            />
            <button
              type="button"
              onClick={() =>
                startTransition(async () => {
                  await fetchApi<OfferRecord>("/api/recruiter/offer", {
                    method: "POST",
                    body: JSON.stringify({
                      candidateId,
                      salary: Number(salary),
                      deadline: new Date(deadline).toISOString(),
                    }),
                  });
                  await loadOffers();
                })
              }
              className="rounded-full bg-[#6666ff] px-5 py-3 text-sm font-semibold text-white"
            >
              Issue Offer
            </button>
          </div>
        </Card>

        <Card title="Offer Tracking" icon={<LineChart size={20} />}>
          <div className="space-y-3">
            {offers.map((offer) => {
              const candidate = candidates.find((entry) => entry.id === offer.candidateId);
              const daysLeft = getDaysUntil(offer.deadline);

              return (
                <div key={offer.id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{candidate?.name || offer.candidateId}</p>
                      <p className="text-sm text-zinc-400">{offer.company} | {offer.salary} LPA</p>
                    </div>
                    <CandidatePill active={offer.status === "accepted"}>{offer.status}</CandidatePill>
                  </div>
                  <p className="mt-2 text-sm text-zinc-300">Deadline: {formatDate(offer.deadline)}</p>
                  {offer.status === "issued" ? (
                    <p className={`mt-2 text-xs font-semibold ${daysLeft <= 3 ? "text-[#f0c9b9]" : "text-[#b9f0d7]"}`}>
                      {daysLeft <= 0 ? "Reminder: follow up now" : `Reminder: ${daysLeft} day(s) left`}
                    </p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["issued", "accepted", "rejected"] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            await fetchApi<OfferRecord>("/api/recruiter/offer", {
                              method: "POST",
                              body: JSON.stringify({
                                offerId: offer.id,
                                candidateId: offer.candidateId,
                                company: offer.company,
                                salary: offer.salary,
                                deadline: offer.deadline,
                                status,
                              }),
                            });
                            await loadOffers();
                          })
                        }
                        className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-200"
                      >
                        Mark {status}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
