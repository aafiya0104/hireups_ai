"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BarChart3, BookOpen, Briefcase, Flame, Trophy } from "lucide-react";
import { EmptyState } from "@/components/app/EmptyState";
import { ProgressRing } from "@/components/app/ProgressRing";
import { SectionTitle } from "@/components/app/SectionTitle";
import { ShellCard } from "@/components/app/ShellCard";
import { formatDate } from "@/lib/utils";
import type { RoadmapRecord } from "@/lib/types";
import DetailedDSATracker from "@/components/DetailedDSATracker";

export function StudentDashboard() {
  const [roadmap, setRoadmap] = useState<RoadmapRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/roadmap")
      .then((res) => res.json())
      .then((data) => setRoadmap(data.roadmaps?.[0] || null))
      .catch(() => toast.error("Unable to load your roadmap right now."))
      .finally(() => setLoading(false));
  }, []);

  const todayTasks = useMemo(
    () => roadmap?.tasks.slice(0, 6) || [],
    [roadmap],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ShellCard className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(102,102,255,0.22),transparent_45%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
          <SectionTitle
            eyebrow="Student Command Center"
            title="Placement readiness that keeps moving even without external APIs"
            description="Roadmaps, contests, company targets, and placement archives all stay live through local fallback logic."
          />
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-300">
            <span className="rounded-full border border-white/10 px-3 py-1">Demo login: `demo@hireups.ai` / `demo123`</span>
            <span className="rounded-full border border-white/10 px-3 py-1">Groq optional, static intelligence mandatory</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/student/roadmap" className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition hover:scale-[1.02]">
              Open Roadmap
            </Link>
            <Link href="/arena" className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/5">
              Enter CP Arena
            </Link>
          </div>
        </ShellCard>

        <ShellCard className="flex items-center justify-center">
          {loading ? <p className="text-zinc-400">Loading progress...</p> : <ProgressRing value={roadmap?.progress || 0} label="readiness" />}
        </ShellCard>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Flame} label="Streak" value={`${roadmap?.streak || 0} days`} accent="text-orange-300" />
        <MetricCard icon={BookOpen} label="Tasks" value={`${roadmap?.tasks.length || 0} planned`} accent="text-[var(--color-periwinkle)]" />
        <MetricCard icon={BarChart3} label="Weak Topics" value={roadmap?.weakTopics.join(", ") || "None yet"} accent="text-[var(--color-celadon)]" />
        <MetricCard icon={Briefcase} label="Target Role" value={roadmap?.targetRole || "Set your role"} accent="text-[var(--color-columbia-blue)]" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <ShellCard>
          <div className="flex items-center justify-between">
            <SectionTitle title="Today and next up" description="Checklist progress, automatic rescheduling, and weak-topic flags come from your stored roadmap state." />
            <Link href="/student/roadmap" className="text-sm font-semibold text-[var(--color-celadon)]">
              Full roadmap
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {!loading && !todayTasks.length ? (
              <EmptyState title="No roadmap yet" description="Generate your roadmap to unlock your daily plan." />
            ) : null}
            {todayTasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Day {task.day}</p>
                    <h3 className="mt-1 font-semibold text-white">{task.title}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{task.topic} • {task.estimatedMinutes} mins • {formatDate(task.date)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${task.completed ? "bg-[var(--color-celadon)]/15 text-[var(--color-celadon)]" : "bg-white/10 text-zinc-300"}`}>
                    {task.completed ? "Done" : task.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.practiceProblems.slice(0, 2).map((problem) => (
                    <span key={problem.title} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                      {problem.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <div className="flex flex-col gap-6">
          <ShellCard>
            <SectionTitle title="Fast actions" description="Jump directly to the hackathon showcase flows." />
            <div className="mt-6 grid gap-3">
              <ActionLink href="/arena" label="Join live contest" description="Monaco editor, Judge0 fallback, leaderboard, AI feedback." icon={Trophy} />
              <ActionLink href="/drives" label="Browse placement drives" description="Filter approved experiences or submit one for moderation." icon={Briefcase} />
              <ActionLink href="/companies" label="View company matches" description="Rule-based matching with optional Groq suggestions." icon={BarChart3} />
            </div>
          </ShellCard>
          
          <DetailedDSATracker />
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <ShellCard>
      <Icon className={`h-6 w-6 ${accent}`} />
      <p className="mt-4 text-sm uppercase tracking-[0.3em] text-zinc-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
    </ShellCard>
  );
}

function ActionLink({
  href,
  label,
  description,
  icon: Icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link href={href} className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-white/20">
      <Icon className="h-5 w-5 text-[var(--color-celadon)]" />
      <h3 className="mt-3 font-semibold text-white">{label}</h3>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
    </Link>
  );
}
