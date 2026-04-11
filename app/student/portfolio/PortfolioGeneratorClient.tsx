"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CircleCheck,
  Copy,
  Download,
  GripVertical,
  LayoutTemplate,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Wand2,
  X,
} from "lucide-react";

const PROFILE_STORAGE_KEY = "hireups-student-profile-v1";

type ProfileSnapshot = {
  name: string;
  branch: string;
  college: string;
  gradYear: string;
  placementTrack: string;
  preferences?: {
    targetRole?: string;
    targetCompanies?: string[];
  };
  links?: {
    githubHandle?: string;
    portfolioUrl?: string;
    linkedinUrl?: string;
  };
};

type RepoCandidate = {
  id: string;
  name: string;
  description: string;
  stack: string[];
  stars: number;
  forks: number;
  contributors: number;
  signals: string[];
  summary: string;
  bullets: string[];
  include: boolean;
  autoExcluded?: boolean;
  reason?: string;
  score: number;
};

type TemplateOption = {
  id: "technical" | "design" | "minimal";
  label: string;
  description: string;
  accent: string;
  recommendedFor: string;
};

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: "technical",
    label: "Technical",
    description: "Best for SDE and systems-heavy roles with strong project detail.",
    accent: "from-[#6666ff] to-[#b8baff]",
    recommendedFor: "SDE-1, Backend, Full Stack",
  },
  {
    id: "design",
    label: "Design",
    description: "Clean portfolio layout with larger cards and a polished visual hierarchy.",
    accent: "from-[#b9f0d7] to-[#c9e8ff]",
    recommendedFor: "Frontend, Product, UI",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "ATS-first layout with concise sections and high readability.",
    accent: "from-[#f0e5b9] to-[#b8baff]",
    recommendedFor: "Freshers, referrals, recruiter review",
  },
];

const ROLE_KEYWORDS: Record<string, string[]> = {
  "sde-1": ["system design", "distributed systems", "apis", "testing"],
  backend: ["apis", "databases", "scalability", "caching"],
  frontend: ["react", "accessibility", "performance", "ui"],
  "full stack": ["react", "node.js", "apis", "postgresql"],
  design: ["ui", "accessibility", "motion", "design systems"],
};

const MOCK_REPOS = [
  {
    name: "placement-pulse",
    description: "Campus placement tracker that predicts interview readiness and surfaces weak topics.",
    readme: "Predicts readiness, tracks DSA progress, and exports a recruiter-friendly summary.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    stars: 34,
    forks: 8,
    contributors: 3,
    topics: ["portfolio", "campus", "placement"],
  },
  {
    name: "focusloop",
    description: "Pomodoro roadmap planner with adaptive task sequencing.",
    readme: "Automatically prioritizes tasks based on difficulty and streak consistency.",
    stack: ["React", "Node.js", "TypeScript"],
    stars: 19,
    forks: 4,
    contributors: 2,
    topics: ["productivity", "tooling"],
  },
  {
    name: "leetcode-practice",
    description: "Practice notes and solutions for interview prep.",
    readme: "Collection of solved problems and quick revisions.",
    stack: ["Python"],
    stars: 2,
    forks: 0,
    contributors: 1,
    topics: ["practice", "college-assignments"],
  },
  {
    name: "cloud-cache",
    description: "Distributed cache prototype for microservices.",
    readme: "Reduces query latency with smarter invalidation and request coalescing.",
    stack: ["Go", "Redis", "Docker"],
    stars: 51,
    forks: 12,
    contributors: 4,
    topics: ["backend", "performance"],
  },
  {
    name: "college-assignments",
    description: "Semester assignments and lab exercises.",
    readme: "Homework submissions and lab solutions.",
    stack: ["Java", "C"],
    stars: 0,
    forks: 0,
    contributors: 1,
    topics: ["college-assignments"],
  },
  {
    name: "ui-systems",
    description: "Design system and component playground.",
    readme: "Reusable UI components, tokens, and interaction patterns.",
    stack: ["React", "Storybook", "Figma"],
    stars: 27,
    forks: 6,
    contributors: 2,
    topics: ["design", "frontend"],
  },
];

const LINKEDIN_FEATURED = [
  "GitHub portfolio",
  "Placement projects",
  "ATS-ready summaries",
];

function defaultSnapshot(): ProfileSnapshot {
  return {
    name: "Aarav Mehta",
    branch: "Computer Science",
    college: "NIT Surathkal",
    gradYear: "2026",
    placementTrack: "Placement Ready",
    preferences: {
      targetRole: "SDE-1",
      targetCompanies: ["Google", "Microsoft", "Amazon"],
    },
    links: {
      githubHandle: "aaravmehta",
      portfolioUrl: "https://hireups.ai/portfolio/aarav-mehta",
      linkedinUrl: "https://linkedin.com/in/aarav-mehta",
    },
  };
}

function loadProfile(): ProfileSnapshot {
  if (typeof window === "undefined") {
    return defaultSnapshot();
  }

  const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) {
    return defaultSnapshot();
  }

  try {
    return { ...defaultSnapshot(), ...JSON.parse(raw) } as ProfileSnapshot;
  } catch {
    return defaultSnapshot();
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getPortfolioUrl(name: string) {
  return `https://${slugify(name || "student")}.hireups.in`;
}

function createRepoSummary(repo: (typeof MOCK_REPOS)[number], role: string, branch: string): RepoCandidate {
  const lowerName = repo.name.toLowerCase();
  const excluded = lowerName.includes("practice") || lowerName.includes("college-assignments") || repo.topics.includes("practice") || repo.topics.includes("college-assignments");
  const roleTerms = ROLE_KEYWORDS[role.toLowerCase()] ?? ["performance", "apis", "testing"];
  const stackCoverage = repo.stack.filter((tech) => roleTerms.some((term) => tech.toLowerCase().includes(term) || term.includes(tech.toLowerCase()))).length;
  const score = Math.min(100, Math.round(52 + repo.stars * 0.7 + repo.forks * 0.8 + repo.contributors * 2 + stackCoverage * 7));
  const verb = repo.name.includes("ui") ? "Designed" : repo.name.includes("cache") ? "Built" : repo.name.includes("focus") ? "Shipped" : "Engineered";
  const bullets = [
    `${verb} ${repo.description.toLowerCase()} to reduce manual prep and make placement work repeatable.`,
    `Used ${repo.stack.slice(0, 3).join(", ")} to keep the stack deployable, searchable, and recruiter-friendly.`,
    `Validated the product against ${Math.max(repo.stars + repo.forks + repo.contributors, 6)} public signals to demonstrate traction and maintainability.`,
  ];

  return {
    id: repo.name,
    name: repo.name,
    description: repo.description,
    stack: repo.stack,
    stars: repo.stars,
    forks: repo.forks,
    contributors: repo.contributors,
    signals: [branch, role, ...repo.topics],
    summary: repo.readme,
    bullets,
    include: !excluded,
    autoExcluded: excluded,
    reason: excluded ? "Low-signal repo excluded automatically." : "Included by AI relevance scoring.",
    score,
  };
}

function ProgressRail({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="space-y-3 rounded-3xl border border-white/5 bg-[#0c0c16]/60 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Generation flow</p>
        <span className="text-xs text-zinc-400">{current + 1}/{steps.length}</span>
      </div>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const active = index === current;
          const done = index < current;
          return (
            <div key={step} className={`flex items-center gap-3 rounded-2xl border p-3 transition ${active ? "border-[#6666ff]/30 bg-[#6666ff]/10" : done ? "border-[#b9f0d7]/20 bg-[#b9f0d7]/10" : "border-white/5 bg-white/5"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${done ? "bg-[#b9f0d7] text-[#0c0c16]" : active ? "bg-[#6666ff] text-white" : "bg-white/10 text-zinc-400"}`}>
                {done ? <CircleCheck size={16} /> : active ? <Sparkles size={16} className="animate-pulse" /> : <span className="text-[11px] font-bold">{index + 1}</span>}
              </div>
              <div>
                <p className={`text-sm font-semibold ${active ? "text-white" : done ? "text-zinc-100" : "text-zinc-400"}`}>{step}</p>
                <p className="text-xs text-zinc-500">{done ? "Completed" : active ? "In progress" : "Queued"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Drawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close drawer" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <aside className="relative z-10 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#090912] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Project editor</p>
            <h3 className="mt-1 text-2xl font-bold text-white">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-300 transition hover:text-white">
            <X size={18} />
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

function TemplateCard({ template, active, onSelect }: { template: TemplateOption; active: boolean; onSelect: () => void }) {
  const activeStyleMap: Record<string, { border: string; bg: string; checkColor: string }> = {
    technical: { border: "border-[#6666ff]/40", bg: "bg-[#6666ff]/10", checkColor: "text-[#b8baff]" },
    design: { border: "border-[#b9f0d7]/40", bg: "bg-[#b9f0d7]/10", checkColor: "text-[#c9e8ff]" },
    minimal: { border: "border-[#f0e5b9]/40", bg: "bg-[#f0e5b9]/10", checkColor: "text-[#f0e5b9]" },
  };
  const styles = activeStyleMap[template.id];
  return (
    <button type="button" onClick={onSelect} className={`w-full rounded-3xl border p-4 text-left transition-all duration-200 ${active ? `${styles.border} ${styles.bg} shadow-lg shadow-current/10` : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"}`}>
      <div className={`mb-3 h-1.5 rounded-full bg-gradient-to-r ${template.accent} transition-shadow duration-300 ${active ? "shadow-lg shadow-current/20" : ""}`} />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-white">{template.label}</p>
          <p className="mt-1 text-sm text-zinc-400">{template.description}</p>
        </div>
        {active ? <CircleCheck className={`${styles.checkColor} transition-colors duration-200`} size={18} /> : <LayoutTemplate className="text-zinc-500 transition-colors duration-200" size={18} />}
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.25em] text-zinc-500">Best for {template.recommendedFor}</p>
    </button>
  );
}

export default function PortfolioGeneratorClient() {
  const [profile, setProfile] = useState<ProfileSnapshot>(defaultSnapshot());
  const [connected, setConnected] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [template, setTemplate] = useState<TemplateOption["id"]>("technical");
  const [drawerProject, setDrawerProject] = useState<RepoCandidate | null>(null);
  const [repos, setRepos] = useState<RepoCandidate[]>([]);
  const [copied, setCopied] = useState(false);
  const [redeployBanner, setRedeployBanner] = useState<string>("");

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  useEffect(() => {
    if (!connected) {
      setStepIndex(0);
      return;
    }

    const timers = [
      window.setTimeout(() => setStepIndex(0), 150),
      window.setTimeout(() => setStepIndex(1), 1000),
      window.setTimeout(() => setStepIndex(2), 2000),
      window.setTimeout(() => setStepIndex(3), 3200),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [connected]);

  useEffect(() => {
    if (!connected) {
      return;
    }

    const role = profile.preferences?.targetRole ?? profile.placementTrack ?? "SDE-1";
    const mapped = MOCK_REPOS.map((repo) => createRepoSummary(repo, role, profile.branch));
    const sorted = mapped.sort((a, b) => b.score - a.score);
    setRepos(sorted);

    const bestTemplate = template;
    setTemplate(bestTemplate);
  }, [connected, profile.branch, profile.preferences?.targetRole]);

  const includedRepos = useMemo(() => repos.filter((repo) => repo.include), [repos]);
  const selectedCount = includedRepos.length;
  const liveUrl = useMemo(() => getPortfolioUrl(profile.name), [profile.name]);
  const previewSkills = useMemo(
    () => Array.from(new Set(includedRepos.flatMap((repo) => repo.stack))).slice(0, 6),
    [includedRepos],
  );
  const previewProjects = useMemo(() => {
    if (template === "minimal") {
      return includedRepos.slice(0, 1);
    }
    if (template === "design") {
      return includedRepos.slice(0, 3);
    }
    return includedRepos.slice(0, 2);
  }, [includedRepos, template]);
  const templateSkin = useMemo(() => {
    if (template === "design") {
      return {
        shell: "bg-[radial-gradient(circle_at_top_left,#b9f0d72a,transparent_45%),radial-gradient(circle_at_bottom_right,#c9e8ff2a,transparent_42%)]",
        card: "border-[#b9f0d7]/20 bg-[#0d1520]/70",
        textAccent: "text-[#c9e8ff]",
      };
    }
    if (template === "minimal") {
      return {
        shell: "bg-[linear-gradient(180deg,#0b0b12_0%,#0a0a11_100%)]",
        card: "border-white/10 bg-black/20",
        textAccent: "text-[#f0e5b9]",
      };
    }
    return {
      shell: "bg-[radial-gradient(circle_at_top_right,#6666ff22,transparent_40%),radial-gradient(circle_at_bottom_left,#b9f0d720,transparent_42%)]",
      card: "border-[#6666ff]/20 bg-[#12142a]/70",
      textAccent: "text-[#b8baff]",
    };
  }, [template]);

  const ats = useMemo(() => {
    const techCoverage = Math.min(100, 60 + includedRepos.flatMap((repo) => repo.stack).length * 3);
    const outcomes = Math.min(100, 45 + includedRepos.reduce((sum, repo) => sum + repo.bullets.filter((bullet) => /\d/.test(bullet)).length * 10, 0));
    const keywords = Math.min(100, 50 + includedRepos.reduce((sum, repo) => sum + repo.stack.length * 4, 0));
    const finalScore = Math.round((techCoverage * 0.35 + outcomes * 0.35 + keywords * 0.3));
    const missing = [
      ...(keywords < 70 ? [profile.preferences?.targetRole ?? "role keyword"] : []),
      ...(outcomes < 70 ? ["measurable outcomes"] : []),
      ...(techCoverage < 75 ? ["stack coverage"] : []),
    ].slice(0, 3);

    return {
      finalScore,
      techCoverage,
      outcomes,
      keywords,
      missing,
    };
  }, [includedRepos, profile.preferences?.targetRole]);

  const stepLabels = ["GitHub connected", "Projects selected", "Template chosen", "Portfolio live"];

  const handleConnect = () => {
    setConnected(true);
    setRedeployBanner("Connecting GitHub and starting portfolio generation...");
    window.setTimeout(() => setRedeployBanner(""), 2600);
  };

  const handleToggleRepo = (id: string) => {
    setRepos((current) => current.map((repo) => (repo.id === id ? { ...repo, include: !repo.include } : repo)));
    setRedeployBanner("Auto-saving changes and silently redeploying...");
    window.setTimeout(() => setRedeployBanner(""), 2200);
  };

  const handleBulletUpdate = (repoId: string, bulletIndex: number, value: string) => {
    setRepos((current) => current.map((repo) => (repo.id === repoId ? { ...repo, bullets: repo.bullets.map((bullet, index) => (index === bulletIndex ? value : bullet)) } : repo)));
    setRedeployBanner("Auto-saving changes and silently redeploying...");
    window.setTimeout(() => setRedeployBanner(""), 2200);
  };

  const handleKeywordInsert = (keyword: string) => {
    setRepos((current) => {
      const targetIndex = current.findIndex((repo) => repo.include);
      if (targetIndex === -1) {
        return current;
      }

      const updated = [...current];
      const repo = updated[targetIndex];
      const existing = repo.bullets[0] ?? "";
      if (existing.toLowerCase().includes(keyword.toLowerCase())) {
        return current;
      }

      updated[targetIndex] = {
        ...repo,
        bullets: repo.bullets.map((bullet, index) => {
          if (index !== 0) {
            return bullet;
          }
          return `${bullet.replace(/\.$/, "")} with ${keyword} naturally woven into the impact narrative.`;
        }),
      };

      return updated;
    });
    setRedeployBanner(`Inserted ${keyword} into the nearest relevant project summary.`);
    window.setTimeout(() => setRedeployBanner(""), 2200);
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleSyncLinkedIn = () => {
    setRedeployBanner(`LinkedIn Featured section prefilled with: ${LINKEDIN_FEATURED.join(" · ")}`);
    window.setTimeout(() => setRedeployBanner(""), 2600);
  };

  const handleRegenerate = (repoId: string) => {
    setRepos((current) => current.map((repo) => {
      if (repo.id !== repoId) {
        return repo;
      }

      const updatedBullets = repo.bullets.map((bullet, index) => {
        if (index === 0) {
          return `${bullet.split(" to ")[0]} to improve clarity, recruiter readability, and quantified impact.`;
        }
        return bullet;
      });

      return {
        ...repo,
        bullets: updatedBullets,
      };
    }));
    setRedeployBanner("Regenerated with AI and redeployed the draft preview.");
    window.setTimeout(() => setRedeployBanner(""), 2500);
  };

  const currentStep = connected ? (stepIndex === 3 ? 3 : stepIndex) : -1;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <Link href="/student" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white">
          <ArrowLeft size={16} /> Back to Student Dashboard
        </Link>
        {redeployBanner ? <span className="text-sm text-[#b9f0d7]">{redeployBanner}</span> : null}
      </div>

      <div className="rounded-[2rem] border border-white/5 bg-gradient-to-br from-[#0c0c16] via-[#0f1020] to-[#090912] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">AI Portfolio Generator</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">Deploy a recruiter-ready portfolio in under 60 seconds.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
              GitHub connects once. HireUps scans repos, infers stack, writes project summaries, selects a template, and deploys a static portfolio to your public name.hireups.in URL.
            </p>
          </div>
          <div className="rounded-3xl border border-[#6666ff]/20 bg-[#6666ff]/10 px-4 py-3 text-sm text-[#b8baff]">
            <div className="flex items-center gap-2 font-semibold text-white">
              <ShieldCheck size={16} className="text-[#b9f0d7]" /> ATS-optimized, fully automated
            </div>
            <p className="mt-1 text-xs text-zinc-300">Uses your profile data when available: {profile.name} · {profile.branch} · {profile.preferences?.targetRole ?? "SDE-1"}</p>
          </div>
        </div>
      </div>

      {!connected ? (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/5 bg-[#0c0c16]/70 p-6">
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-white/10 bg-black/20 p-8 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#6666ff]/15 text-[#b8baff]">
                <Sparkles size={34} />
              </div>
              <h2 className="text-2xl font-bold text-white">Connect GitHub</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                We scan public repositories, ignore forks/archives/low-signal practice repos, and generate an ATS portfolio automatically.
              </p>
              <button type="button" onClick={handleConnect} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#6666ff] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#b8baff] hover:text-zinc-900 hover:shadow-lg hover:shadow-[#6666ff]/20 active:scale-95">
                <Sparkles size={16} /> Connect GitHub
              </button>
              <div className="mt-8 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
                {[
                  "Reads your repos",
                  "AI writes summaries",
                  "Deploys in 60s",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="font-semibold text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4 rounded-[2rem] border border-white/5 bg-[#0c0c16]/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">What happens after connect</p>
            <ProgressRail steps={["Reading repos", "Inferring stack", "Writing summaries", "Deploying"]} current={currentStep} />
            <div className="rounded-3xl border border-[#b9f0d7]/20 bg-[#b9f0d7]/10 p-4">
              <p className="text-sm font-semibold text-[#b9f0d7]">Silent mode</p>
              <p className="mt-1 text-sm text-zinc-300">The generator will use your profile from HireUps to prefill the URL, template recommendation, and ATS keywords.</p>
            </div>
          </aside>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/5 bg-[#0c0c16]/70 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Step tracker</p>
                  <h2 className="mt-1 text-xl font-bold text-white">Portfolio flow</h2>
                </div>
                <span className="rounded-full border border-[#b9f0d7]/20 bg-[#b9f0d7]/10 px-3 py-1 text-xs font-semibold text-[#b9f0d7]">{connected ? "Live" : "Idle"}</span>
              </div>
              <div className="space-y-3">
                {stepLabels.map((label, index) => {
                  const done = connected && index < stepIndex;
                  const active = connected && index === stepIndex;
                  return (
                    <div key={label} className={`flex items-center gap-3 rounded-2xl border p-3 ${done ? "border-[#b9f0d7]/20 bg-[#b9f0d7]/10" : active ? "border-[#6666ff]/30 bg-[#6666ff]/10" : "border-white/5 bg-white/5"}`}>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${done ? "bg-[#b9f0d7] text-[#0c0c16]" : active ? "bg-[#6666ff] text-white" : "bg-white/10 text-zinc-400"}`}>
                        {done ? <CheckCircle2 size={16} /> : <span className="text-[11px] font-bold">{index + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${done || active ? "text-white" : "text-zinc-400"}`}>{label}</p>
                        <p className="text-xs text-zinc-500">{done ? "Completed" : active ? "Working now" : "Queued"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/5 bg-[#0c0c16]/70 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Projects selected</p>
                  <h2 className="mt-1 text-xl font-bold text-white">AI-written summaries</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">{selectedCount} included</span>
              </div>
              <div className="space-y-3">
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setDrawerProject(repo)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setDrawerProject(repo);
                      }
                    }}
                    className={`w-full rounded-3xl border p-4 text-left transition ${repo.include ? "border-white/10 bg-white/5 hover:border-[#6666ff]/30" : "border-white/5 bg-black/20 opacity-70 hover:opacity-100"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{repo.name}</h3>
                          {repo.autoExcluded ? <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-red-300">Auto-excluded</span> : null}
                        </div>
                        <p className="mt-1 text-sm text-zinc-400">{repo.summary}</p>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500">
                        <GripVertical size={16} />
                        {repo.include ? <ToggleRight className="text-[#b9f0d7]" size={20} /> : <ToggleLeft className="text-zinc-500" size={20} />}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {repo.stack.map((tech) => (
                        <span key={tech} className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-zinc-300">{tech}</span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="text-xs text-zinc-500">{repo.reason}</div>
                      <button type="button" onClick={(event) => { event.stopPropagation(); handleToggleRepo(repo.id); }} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:border-[#6666ff]/30 hover:bg-[#6666ff]/10 active:scale-95">
                        {repo.include ? "Exclude" : "Include"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="space-y-4 rounded-[2rem] border border-white/5 bg-[#0c0c16]/70 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Template picker</p>
                  <h2 className="mt-1 text-xl font-bold text-white">AI auto-selected</h2>
                </div>
                <span className="rounded-full border border-[#6666ff]/20 bg-[#6666ff]/10 px-3 py-1 text-xs font-semibold text-[#b8baff]">1-click override</span>
              </div>
              <div className="space-y-3">
                {TEMPLATE_OPTIONS.map((option) => (
                  <TemplateCard key={option.id} template={option} active={template === option.id} onSelect={() => setTemplate(option.id)} />
                ))}
              </div>
            </section>

            <section className="space-y-4 rounded-[2rem] border border-white/5 bg-[#0c0c16]/70 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">ATS scorer</p>
                  <h2 className="mt-1 text-xl font-bold text-white">Portfolio quality</h2>
                </div>
                <div className="rounded-3xl border border-[#b9f0d7]/20 bg-[#b9f0d7]/10 p-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#b9f0d7]">ATS score</p>
                  <p className="mt-2 text-5xl font-bold text-white">{ats.finalScore}</p>
                  <p className="mt-1 text-sm text-zinc-300">Optimized against {profile.preferences?.targetRole ?? "your target role"}</p>
                </div>
                <div className="space-y-3 text-sm text-zinc-300">
                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3"><span>Keyword density</span><span className="font-semibold text-white">{ats.keywords}%</span></div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3"><span>Measurable outcomes</span><span className="font-semibold text-white">{ats.outcomes}%</span></div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3"><span>Tech coverage</span><span className="font-semibold text-white">{ats.techCoverage}%</span></div>
                </div>
                <div className="rounded-3xl border border-[#f0e5b9]/20 bg-[#f0e5b9]/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f0e5b9]">Missing suggestions</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ats.missing.length > 0 ? ats.missing.map((keyword) => (
                      <button key={keyword} type="button" onClick={() => handleKeywordInsert(keyword)} className="rounded-full border border-[#f0e5b9]/20 bg-[#f0e5b9]/10 px-3 py-1.5 text-xs font-semibold text-[#f0e5b9] transition-all duration-200 hover:bg-[#f0e5b9]/20 hover:border-[#f0e5b9]/40 active:scale-95">
                        + {keyword}
                      </button>
                    )) : <span className="text-sm text-zinc-300">No major gaps detected.</span>}
                  </div>
                </div>
              </section>

            <section className="rounded-[2rem] border border-white/5 bg-[#0c0c16]/70 p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Portfolio preview</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">Live website</h2>
                </div>
                <span className="rounded-full border border-[#b9f0d7]/20 bg-[#b9f0d7]/10 px-3 py-1 text-xs font-semibold text-[#b9f0d7]">Live</span>
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080811]">
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#0f1020] px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                    </div>
                  </div>

                  <div className={`space-y-5 p-5 ${templateSkin.shell}`}>
                    <div className={`rounded-2xl border p-5 ${templateSkin.card}`}>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">{profile.college} • {profile.gradYear}</p>
                      <h3 className="mt-2 text-2xl font-bold text-white">{profile.name}</h3>
                      <p className="mt-1 text-sm text-zinc-300">{profile.preferences?.targetRole ?? "SDE-1"} • {profile.branch}</p>
                      <p className={`mt-2 text-xs font-semibold uppercase tracking-[0.25em] ${templateSkin.textAccent}`}>
                        {template === "technical" ? "Technical depth layout" : template === "design" ? "Visual-first portfolio layout" : "ATS-minimal clean layout"}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(previewSkills.length > 0 ? previewSkills : ["Next.js", "TypeScript", "System Design"]).map((skill) => (
                          <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`grid gap-3 transition-all duration-300 ${template === "design" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                      {previewProjects.map((repo) => (
                        <div key={repo.id} className={`rounded-2xl border bg-white/5 p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/8 ${template === "minimal" ? "md:col-span-2 border-white/10" : "border-white/10"}`}>
                          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Featured project</p>
                          <h4 className="mt-1 text-base font-bold text-white">{repo.name}</h4>
                          <p className={`mt-1 text-sm text-zinc-300 ${template === "minimal" ? "line-clamp-2" : "line-clamp-3"}`}>{repo.bullets[0]}</p>
                          {template !== "minimal" ? (
                            <div className="mt-2 text-xs text-zinc-400">
                              Stack: {repo.stack.slice(0, 3).join(" • ")}
                            </div>
                          ) : null}
                        </div>
                      ))}
                      {includedRepos.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-4 md:col-span-2">
                          <p className="text-sm text-zinc-400">No included projects yet. Toggle repos on the left to populate this preview.</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

            <div className="flex gap-3">
              <button type="button" onClick={handleExportPdf} className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6666ff] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#b8baff] hover:text-zinc-900 hover:shadow-lg hover:shadow-[#6666ff]/20 active:scale-95">
                <Download size={16} /> Export PDF
              </button>
              <button type="button" onClick={handleSyncLinkedIn} className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-[#b8baff]/30 bg-[#b8baff]/10 px-4 py-3 text-sm font-semibold text-[#b8baff] transition-all duration-200 hover:bg-[#b8baff]/20 hover:border-[#b8baff]/50 hover:shadow-lg hover:shadow-[#b8baff]/10 active:scale-95">
                <Sparkles size={16} /> Sync LinkedIn
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Template</p>
                  <p className="mt-2 text-lg font-semibold text-white">{TEMPLATE_OPTIONS.find((option) => option.id === template)?.label}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">GitHub repos live</p>
                  <p className="mt-2 text-lg font-semibold text-white">{selectedCount}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Deploy status</p>
                  <p className="mt-2 text-lg font-semibold text-[#b9f0d7]">Portfolio live</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      <Drawer open={Boolean(drawerProject)} title={drawerProject?.name ?? "Project"} onClose={() => setDrawerProject(null)}>
        {drawerProject ? (
          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-zinc-500">
                <Sparkles size={12} /> AI summary
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{drawerProject.summary}</p>
            </div>

            <div className="space-y-3">
              {drawerProject.bullets.map((bullet, index) => (
                <label key={index} className="block space-y-2 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">Bullet {index + 1}</span>
                    <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] text-zinc-400">Action verb → built → outcome</span>
                  </div>
                  <textarea value={bullet} onChange={(event) => handleBulletUpdate(drawerProject.id, index, event.target.value)} className="min-h-24 w-full rounded-2xl border border-white/10 bg-[#090912] px-4 py-3 text-sm text-white outline-none" />
                </label>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => handleRegenerate(drawerProject.id)} className="inline-flex items-center gap-2 rounded-2xl bg-[#6666ff] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#b8baff] hover:text-zinc-900 hover:shadow-lg hover:shadow-[#6666ff]/20 active:scale-95">
                <Wand2 size={16} /> Regenerate with AI
              </button>
              <button type="button" onClick={() => handleToggleRepo(drawerProject.id)} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-white/20 hover:bg-white/8 active:scale-95">
                {drawerProject.include ? <ToggleRight size={16} className="text-[#b9f0d7]" /> : <ToggleLeft size={16} />} {drawerProject.include ? "Exclude from portfolio" : "Include in portfolio"}
              </button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}