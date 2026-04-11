"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Briefcase,
  Building2,
  CircleCheck,
  Download,
  Filter,
  GraduationCap,
  LineChart,
  LoaderCircle,
  Mail,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Target,
  UserPlus,
  Users,
} from "lucide-react";

import type {
  AlumniRecord,
  ApiResponse,
  CompanyRecord,
  DriveRecord,
  OutreachRecord,
  PlacementStatsRecord,
} from "@/lib/tpo-types";

type StatsPayload = {
  summary: PlacementStatsRecord;
  charts: Array<{ year: number; avgCTC: number; companies: number; selectionRate: number }>;
};

type DrivesPayload = {
  drives: DriveRecord[];
  comparison: DriveRecord[];
};

function useApiData<T>(endpoint: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metaMessage, setMetaMessage] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(endpoint, { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<T>;
      setData(payload.data);
      setMetaMessage(payload.meta.message ?? "");
    } catch (err) {
      console.error(`Failed to fetch ${endpoint}`, err);
      setError("Live data is temporarily unavailable. Showing the safest available state.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  return { data, setData, loading, error, metaMessage, reload: load };
}

function SectionCard({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: typeof Building2;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-lg font-heading font-bold text-white">
            <Icon className="h-5 w-5 text-[var(--color-celadon)]" />
            <span>{title}</span>
          </div>
          {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-8 text-center text-sm text-zinc-400">
      {message}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-8 text-sm text-zinc-300">
      <LoaderCircle className="h-4 w-4 animate-spin" />
      <span>Loading live placement data...</span>
    </div>
  );
}

function InfoStrip({ error, message }: { error?: string; message?: string }) {
  if (!error && !message) {
    return null;
  }

  return (
    <div className="mb-4 rounded-2xl border border-[#b8baff]/20 bg-[#b8baff]/10 px-4 py-3 text-sm text-[#e7e7ff]">
      {error || message}
    </div>
  );
}

function formatLpa(value: number) {
  return `INR ${value.toFixed(1)} LPA`;
}

export function TpoDashboardOverview() {
  const companiesApi = useApiData<CompanyRecord[]>("/api/tpo/companies", []);
  const alumniApi = useApiData<AlumniRecord[]>("/api/tpo/alumni", []);
  const outreachApi = useApiData<OutreachRecord[]>("/api/tpo/outreach", []);
  const statsApi = useApiData<StatsPayload>("/api/tpo/stats", {
    summary: { id: "stats", totalOffers: 0, avgCTC: 0, placementRate: 0, unplaced: 0 },
    charts: [],
  });

  const loading =
    companiesApi.loading || alumniApi.loading || outreachApi.loading || statsApi.loading;

  if (loading) {
    return <LoadingState />;
  }

  const kpis = [
    {
      label: "Total Offers",
      value: statsApi.data.summary.totalOffers,
      icon: Briefcase,
    },
    {
      label: "Avg CTC",
      value: formatLpa(statsApi.data.summary.avgCTC),
      icon: LineChart,
    },
    {
      label: "Placement Rate",
      value: `${statsApi.data.summary.placementRate}%`,
      icon: Target,
    },
    {
      label: "Active Alumni",
      value: alumniApi.data.filter((entry) => entry.isActive).length,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <InfoStrip
        error={companiesApi.error || alumniApi.error || outreachApi.error || statsApi.error}
        message={
          companiesApi.metaMessage ||
          alumniApi.metaMessage ||
          outreachApi.metaMessage ||
          statsApi.metaMessage
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-5"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6666ff]/15">
              <Icon className="h-5 w-5 text-[#c9e8ff]" />
            </div>
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="mt-2 text-3xl font-heading font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionCard
          title="Top Recruiter Discovery"
          subtitle="Highest-ranked companies based on hiring frequency, role fit, salary strength, and tier alignment."
          icon={Sparkles}
          action={
            <Link
              href="/tpo/companies"
              className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-white/5"
            >
              Open full list
            </Link>
          }
        >
          <div className="space-y-3">
            {companiesApi.data.slice(0, 5).map((company) => (
              <div
                key={company.id}
                className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">{company.name}</p>
                  <p className="text-sm text-zinc-400">{company.roles.join(", ")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#b9f0d7]/12 px-3 py-1 text-sm text-[#b9f0d7]">
                    Score {company.score}
                  </span>
                  <span className="text-sm text-zinc-300">{formatLpa(company.avgSalary)}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Alumni Radar"
            subtitle="Active alumni are highlighted for faster outreach."
            icon={GraduationCap}
          >
            <div className="space-y-3">
              {alumniApi.data.slice(0, 4).map((alumni) => (
                <div
                  key={alumni.id}
                  className={`rounded-2xl border p-4 ${
                    alumni.isActive
                      ? "border-[#b9f0d7]/25 bg-[#b9f0d7]/10"
                      : "border-white/8 bg-black/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{alumni.name}</p>
                      <p className="text-sm text-zinc-400">
                        {alumni.role} at {alumni.company}
                      </p>
                    </div>
                    {alumni.isActive ? (
                      <span className="rounded-full bg-[#b9f0d7]/15 px-2.5 py-1 text-xs font-semibold text-[#b9f0d7]">
                        Active
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Outreach Pipeline"
            subtitle="Latest recruiter and alumni communication logs."
            icon={Mail}
          >
            <div className="space-y-3">
              {outreachApi.data.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{item.recipientName}</p>
                    <span className="rounded-full bg-[#6666ff]/15 px-2.5 py-1 text-xs text-[#d5d7ff]">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{item.company}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export function CompaniesPageClient() {
  const api = useApiData<CompanyRecord[]>("/api/tpo/companies", []);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "avgSalary" | "hiringFrequency">("score");
  const [form, setForm] = useState({
    name: "",
    roles: "",
    avgSalary: "",
    hiringFrequency: "",
    tierMatch: "",
  });
  const [editingId, setEditingId] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    return [...api.data]
      .filter((company) => {
        const text = `${company.name} ${company.roles.join(" ")}`.toLowerCase();
        const searchMatch = deferredQuery ? text.includes(deferredQuery.toLowerCase()) : true;
        const roleMatch = role
          ? company.roles.some((entry) => entry.toLowerCase().includes(role.toLowerCase()))
          : true;
        return searchMatch && roleMatch;
      })
      .sort((a, b) => Number(b[sortBy]) - Number(a[sortBy]));
  }, [api.data, deferredQuery, role, sortBy]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      name: form.name,
      roles: form.roles.split(",").map((entry) => entry.trim()).filter(Boolean),
      avgSalary: Number(form.avgSalary),
      hiringFrequency: Number(form.hiringFrequency),
      tierMatch: Number(form.tierMatch),
    };

    const url = editingId ? `/api/tpo/companies/${editingId}` : "/api/tpo/companies";
    const method = editingId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setForm({ name: "", roles: "", avgSalary: "", hiringFrequency: "", tierMatch: "" });
    setEditingId("");
    await api.reload();
  };

  return (
    <div className="space-y-6">
      <InfoStrip error={api.error} message={api.metaMessage} />

      <SectionCard
        title="AI Recruiter Discovery"
        subtitle="Sort companies, filter by role, and update the live pipeline."
        icon={Building2}
      >
        <div className="grid gap-3 lg:grid-cols-[1fr_0.7fr_0.5fr]">
          <label className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
              <Search className="h-4 w-4" />
              Search companies
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-white outline-none"
              placeholder="Amazon, SDE, frontend..."
            />
          </label>
          <label className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
              <Filter className="h-4 w-4" />
              Filter by role
            </div>
            <input
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full bg-transparent text-white outline-none"
              placeholder="Backend Developer"
            />
          </label>
          <label className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="mb-2 text-sm text-zinc-400">Sort by</div>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
              className="w-full bg-transparent text-white outline-none"
            >
              <option className="bg-[#0c0c16]" value="score">
                Score
              </option>
              <option className="bg-[#0c0c16]" value="avgSalary">
                Avg salary
              </option>
              <option className="bg-[#0c0c16]" value="hiringFrequency">
                Hiring frequency
              </option>
            </select>
          </label>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Roles</th>
                  <th className="px-4 py-3">Avg Salary</th>
                  <th className="px-4 py-3">Hiring</th>
                  <th className="px-4 py-3">Tier Match</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filtered.map((company) => (
                  <tr key={company.id} className="bg-black/20">
                    <td className="px-4 py-3 font-medium text-white">{company.name}</td>
                    <td className="px-4 py-3 text-zinc-300">{company.roles.join(", ")}</td>
                    <td className="px-4 py-3 text-zinc-300">{formatLpa(company.avgSalary)}</td>
                    <td className="px-4 py-3 text-zinc-300">{company.hiringFrequency}</td>
                    <td className="px-4 py-3 text-zinc-300">{company.tierMatch}</td>
                    <td className="px-4 py-3 text-[#b9f0d7]">{company.score}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setEditingId(company.id);
                          setForm({
                            name: company.name,
                            roles: company.roles.join(", "),
                            avgSalary: String(company.avgSalary),
                            hiringFrequency: String(company.hiringFrequency),
                            tierMatch: String(company.tierMatch),
                          });
                        }}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-200 transition hover:bg-white/5"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title={editingId ? "Edit Company" : "Add Company"}
        subtitle="Admin controls for the recruiter intelligence layer."
        icon={UserPlus}
      >
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {[
            { key: "name", placeholder: "Company name" },
            { key: "roles", placeholder: "Roles comma separated" },
            { key: "avgSalary", placeholder: "Avg salary (LPA)" },
            { key: "hiringFrequency", placeholder: "Hiring frequency" },
            { key: "tierMatch", placeholder: "Tier match score" },
          ].map((field) => (
            <input
              key={field.key}
              value={form[field.key as keyof typeof form]}
              onChange={(event) =>
                setForm((current) => ({ ...current, [field.key]: event.target.value }))
              }
              placeholder={field.placeholder}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
            />
          ))}
          <button
            type="submit"
            className="rounded-2xl bg-[#6666ff] px-4 py-3 font-semibold text-white transition hover:bg-[#7d7dff]"
          >
            {editingId ? "Save changes" : "Add company"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}

export function AlumniPageClient() {
  const api = useApiData<AlumniRecord[]>("/api/tpo/alumni", []);
  const [filters, setFilters] = useState({
    company: "",
    role: "",
    search: "",
    name: "",
    newCompany: "",
    newRole: "",
    seniority: "",
    techStack: "",
  });
  const deferredSearch = useDeferredValue(filters.search);

  const filtered = useMemo(() => {
    return api.data.filter((alumni) => {
      const companyMatch = filters.company
        ? alumni.company.toLowerCase().includes(filters.company.toLowerCase())
        : true;
      const roleMatch = filters.role
        ? alumni.role.toLowerCase().includes(filters.role.toLowerCase())
        : true;
      const searchMatch = deferredSearch
        ? alumni.name.toLowerCase().includes(deferredSearch.toLowerCase())
        : true;
      return companyMatch && roleMatch && searchMatch;
    });
  }, [api.data, deferredSearch, filters.company, filters.role]);

  const addAlumni = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetch("/api/tpo/alumni", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: filters.name,
        company: filters.newCompany,
        role: filters.newRole,
        seniority: filters.seniority,
        techStack: filters.techStack.split(",").map((entry) => entry.trim()).filter(Boolean),
        isActive: true,
      }),
    });
    setFilters((current) => ({
      ...current,
      name: "",
      newCompany: "",
      newRole: "",
      seniority: "",
      techStack: "",
    }));
    await api.reload();
  };

  return (
    <div className="space-y-6">
      <InfoStrip error={api.error} message={api.metaMessage} />

      <SectionCard
        title="Alumni Radar"
        subtitle="Filter by company, role, or name and surface active alumni quickly."
        icon={GraduationCap}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            placeholder="Search by name"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
          <input
            value={filters.company}
            onChange={(event) => setFilters((current) => ({ ...current, company: event.target.value }))}
            placeholder="Filter by company"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
          <input
            value={filters.role}
            onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))}
            placeholder="Filter by role"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {filtered.length === 0 ? (
            <div className="lg:col-span-2">
              <EmptyState message="No alumni found" />
            </div>
          ) : (
            filtered.map((alumni) => (
              <div
                key={alumni.id}
                className={`rounded-3xl border p-5 ${
                  alumni.isActive
                    ? "border-[#b9f0d7]/25 bg-[#b9f0d7]/10"
                    : "border-white/10 bg-black/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-heading font-bold text-white">{alumni.name}</p>
                    <p className="text-sm text-zinc-400">
                      {alumni.role} at {alumni.company}
                    </p>
                  </div>
                  {alumni.isActive ? (
                    <span className="rounded-full bg-[#b9f0d7]/15 px-2.5 py-1 text-xs font-semibold text-[#b9f0d7]">
                      Active
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-zinc-300">Seniority: {alumni.seniority}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {alumni.techStack.map((tech) => (
                    <span
                      key={`${alumni.id}-${tech}`}
                      className="rounded-full bg-white/8 px-3 py-1 text-xs text-zinc-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Add Alumni"
        subtitle="Admin entry form for new alumni connections."
        icon={UserPlus}
      >
        <form onSubmit={addAlumni} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input
            value={filters.name}
            onChange={(event) => setFilters((current) => ({ ...current, name: event.target.value }))}
            placeholder="Name"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
          <input
            value={filters.newCompany}
            onChange={(event) =>
              setFilters((current) => ({ ...current, newCompany: event.target.value }))
            }
            placeholder="Company"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
          <input
            value={filters.newRole}
            onChange={(event) => setFilters((current) => ({ ...current, newRole: event.target.value }))}
            placeholder="Role"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
          <input
            value={filters.seniority}
            onChange={(event) =>
              setFilters((current) => ({ ...current, seniority: event.target.value }))
            }
            placeholder="Seniority"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
          <input
            value={filters.techStack}
            onChange={(event) =>
              setFilters((current) => ({ ...current, techStack: event.target.value }))
            }
            placeholder="Tech stack comma separated"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
          <button
            type="submit"
            className="rounded-2xl bg-[#6666ff] px-4 py-3 font-semibold text-white transition hover:bg-[#7d7dff]"
          >
            Add alumni
          </button>
        </form>
      </SectionCard>
    </div>
  );
}

export function OutreachPageClient() {
  const api = useApiData<OutreachRecord[]>("/api/tpo/outreach", []);
  const [form, setForm] = useState({ recipient: "", company: "" });
  const [sending, setSending] = useState(false);

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    try {
      await fetch("/api/tpo/outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ recipient: "", company: "" });
      await api.reload();
    } finally {
      setSending(false);
    }
  };

  const approve = async (id: string) => {
    await fetch(`/api/tpo/outreach/${id}/approve`, { method: "PATCH" });
    await api.reload();
  };

  return (
    <div className="space-y-6">
      <InfoStrip error={api.error} message={api.metaMessage} />

      <SectionCard
        title="AI Outreach System"
        subtitle="Generate outreach, store logs, and approve conversations from one place."
        icon={Send}
      >
        <form onSubmit={sendMessage} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            value={form.recipient}
            onChange={(event) => setForm((current) => ({ ...current, recipient: event.target.value }))}
            placeholder="Recipient name"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
          <input
            value={form.company}
            onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
            placeholder="Company"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6666ff] px-5 py-3 font-semibold text-white transition hover:bg-[#7d7dff] disabled:opacity-60"
          >
            {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send outreach
          </button>
        </form>
      </SectionCard>

      <SectionCard
        title="Outreach Logs"
        subtitle="Approval state and delivery simulation are stored with each message."
        icon={Mail}
      >
        <div className="space-y-4">
          {api.data.map((item) => (
            <div key={item.id} className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {item.recipientName} · {item.company}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{item.message}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#b8baff]/15 px-3 py-1 text-xs text-[#e7e7ff]">
                    {item.status}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.approved
                        ? "bg-[#b9f0d7]/15 text-[#b9f0d7]"
                        : "bg-white/10 text-zinc-300"
                    }`}
                  >
                    {item.approved ? "Approved" : "Pending approval"}
                  </span>
                  {!item.approved ? (
                    <button
                      onClick={() => approve(item.id)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-100 transition hover:bg-white/5"
                    >
                      Approve
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function AnalyticsPageClient() {
  const api = useApiData<StatsPayload>("/api/tpo/stats", {
    summary: { id: "stats", totalOffers: 0, avgCTC: 0, placementRate: 0, unplaced: 0 },
    charts: [],
  });

  const chartMax = Math.max(...api.data.charts.map((entry) => entry.avgCTC), 1);

  return (
    <div className="space-y-6">
      <InfoStrip error={api.error} message={api.metaMessage} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Offers", api.data.summary.totalOffers],
          ["Avg CTC", formatLpa(api.data.summary.avgCTC)],
          ["Placement Rate", `${api.data.summary.placementRate}%`],
          ["Unplaced", api.data.summary.unplaced],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="mt-2 text-3xl font-heading font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <SectionCard
        title="Placement Analytics"
        subtitle="KPI summary and historical chart built from drive records or safe fallback data."
        icon={BarChart3}
      >
        {api.loading ? (
          <LoadingState />
        ) : (
          <div className="space-y-4">
            {api.data.charts.map((item) => (
              <div key={item.year} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-zinc-300">
                  <span>{item.year}</span>
                  <span>{formatLpa(item.avgCTC)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6666ff] to-[#b9f0d7]"
                    style={{ width: `${(item.avgCTC / chartMax) * 100}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-400">
                  <span>Companies: {item.companies}</span>
                  <span>Selection Rate: {item.selectionRate}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

export function DrivesPageClient() {
  const [year, setYear] = useState("");
  const [compareYear, setCompareYear] = useState("");
  const endpoint = `/api/tpo/drives${year || compareYear ? "?" : ""}${new URLSearchParams(
    Object.entries({ year, compareYear }).filter(([, value]) => value),
  ).toString()}`;
  const api = useApiData<DrivesPayload>(endpoint, { drives: [], comparison: [] });

  const years = useMemo(() => {
    const values = new Set<number>();
    api.data.drives.forEach((drive) => values.add(drive.year));
    api.data.comparison.forEach((drive) => values.add(drive.year));
    return Array.from(values).sort();
  }, [api.data.comparison, api.data.drives]);

  return (
    <div className="space-y-6">
      <InfoStrip error={api.error} message={api.metaMessage} />

      <SectionCard
        title="Previous Drives"
        subtitle="Filter by year, compare batches, and export visible rows as CSV."
        icon={RefreshCw}
        action={
          <a
            href={`/api/tpo/drives?${new URLSearchParams(
              Object.entries({ year, compareYear, format: "csv" }).filter(([, value]) => value),
            ).toString()}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-white/5"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </a>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={year}
            onChange={(event) => setYear(event.target.value)}
            placeholder="Filter year, e.g. 2025"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
          <input
            value={compareYear}
            onChange={(event) => setCompareYear(event.target.value)}
            placeholder="Compare year, e.g. 2024"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {[...api.data.drives, ...api.data.comparison].map((drive) => (
            <div key={drive.id} className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <p className="text-lg font-heading font-bold text-white">{drive.year}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-zinc-300">
                <span>Companies: {drive.companies}</span>
                <span>Roles: {drive.roles}</span>
                <span>Salary: {formatLpa(drive.salary)}</span>
                <span>Selection Rate: {drive.selectionRate}%</span>
              </div>
            </div>
          ))}
        </div>

        {api.data.drives.length === 0 && api.data.comparison.length === 0 ? (
          <div className="mt-5">
            <EmptyState message="No drive records matched the selected year." />
          </div>
        ) : null}

        {years.length > 0 ? (
          <div className="mt-5 text-sm text-zinc-400">Available years: {years.join(", ")}</div>
        ) : null}
      </SectionCard>
    </div>
  );
}

export function TpoLandingHero() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(102,102,255,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(185,240,215,0.16),transparent_30%),rgba(255,255,255,0.03)] p-8">
      <div className="max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200">
          <CircleCheck className="h-4 w-4 text-[#b9f0d7]" />
          Fully functional placement operations workspace
        </p>
        <h1 className="mt-6 text-4xl font-heading font-bold text-white md:text-6xl">
          TPO dashboard built for live recruiter discovery and placement control.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
          Navigate the modules below to manage companies, alumni, outreach, analytics, and
          historical drive performance from one resilient App Router workflow.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {[
            ["/tpo/dashboard", "Open dashboard"],
            ["/tpo/companies", "Manage companies"],
            ["/tpo/outreach", "Run outreach"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
