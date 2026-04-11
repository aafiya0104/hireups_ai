"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  CirclePlus,
  Copy,
  FileUp,
  GitBranch,
  GraduationCap,
  HeartHandshake,
  Link2,
  LucideIcon,
  PencilLine,
  Rocket,
  Search,
  Send,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Zap,
} from "lucide-react";
import { SAMPLE_MASTERY } from "@/lib/roadmap-data";

type ExperienceEntry = {
  company: string;
  role: string;
  team: string;
  duration: string;
};

type ProjectEntry = {
  name: string;
  description: string;
  impact: string;
  tags: string[];
};

type ProfileState = {
  avatarUrl: string | null;
  name: string;
  college: string;
  branch: string;
  gradYear: string;
  placementTrack: string;
  streak: number;
  academic: {
    specialization: string;
    cgpa: string;
    twelfth: string;
    tenth: string;
    activeBacklogs: string;
    graduationYear: string;
  };
  preferences: {
    targetRole: string;
    targetCompanies: string[];
    minCTC: string;
    workMode: string;
    preferredCities: string[];
    relocation: boolean;
    placementWindow: string;
  };
  technical: {
    dsa: number;
    systems: number;
    design: number;
    tags: string[];
  };
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  links: {
    githubConnected: boolean;
    githubHandle: string;
    leetcodeUsername: string;
    leetcodeSolved: number;
    linkedinUrl: string;
    portfolioUrl: string;
    resumeName: string;
  };
  bio: string;
};

const STORAGE_KEY = "hireups-student-profile-v1";

const COMPANY_OPTIONS = ["Google", "Microsoft", "Amazon", "Adobe", "Atlassian", "Flipkart", "Zomato", "Razorpay"];
const CITY_OPTIONS = ["Bengaluru", "Hyderabad", "Pune", "Delhi NCR", "Mumbai", "Remote"];
const ROLE_OPTIONS = ["SDE-1", "Frontend Engineer", "Backend Engineer", "Full-Stack Engineer", "Data Engineer", "ML Engineer"];
const WORK_OPTIONS = ["Hybrid", "Remote", "On-site"];
const WINDOW_OPTIONS = ["Immediate", "0-3 months", "3-6 months", "6+ months"];
const TAG_SUGGESTIONS = [
  "Java",
  "Python",
  "C++",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "Tailwind CSS",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Git",
  "AWS",
  "Figma",
  "Spring Boot",
];

const defaultProjects: ProjectEntry[] = [
  {
    name: "PlacementPulse",
    description: "A campus placement tracker that predicts interview readiness and flags weak topics before deadlines.",
    impact: "Reduced prep gaps by 34% for pilot users",
    tags: ["Next.js", "PostgreSQL", "AI"],
  },
  {
    name: "FocusLoop",
    description: "Pomodoro-plus roadmap planner that turns daily practice into auto-prioritized sessions.",
    impact: "Improved weekly consistency from 62% to 88%",
    tags: ["React", "Node.js", "Tailwind CSS"],
  },
];

const defaultProfile: ProfileState = {
  avatarUrl: null,
  name: "Aarav Mehta",
  college: "NIT Surathkal",
  branch: "Computer Science",
  gradYear: "2026",
  placementTrack: "Placement Ready",
  streak: 7,
  academic: {
    specialization: "AI & Systems",
    cgpa: "8.9",
    twelfth: "94",
    tenth: "96",
    activeBacklogs: "0",
    graduationYear: "2026",
  },
  preferences: {
    targetRole: "SDE-1",
    targetCompanies: ["Google", "Microsoft", "Amazon"],
    minCTC: "18",
    workMode: "Hybrid",
    preferredCities: ["Bengaluru", "Hyderabad"],
    relocation: true,
    placementWindow: "0-3 months",
  },
  technical: {
    dsa: 82,
    systems: 64,
    design: 58,
    tags: ["Java", "C++", "React", "Node.js", "PostgreSQL"],
  },
  experience: [],
  projects: defaultProjects,
  links: {
    githubConnected: false,
    githubHandle: "aaravmehta",
    leetcodeUsername: "aarav_mehta",
    leetcodeSolved: 184,
    linkedinUrl: "https://linkedin.com/in/aarav-mehta",
    portfolioUrl: "https://hireups.ai/portfolio/aarav-mehta",
    resumeName: "Aarav-Mehta-Resume.pdf",
  },
  bio: "Computer science student focused on building reliable systems, solving interview problems consistently, and shipping products that help teams move faster.",
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function progressRing(percent: number, size = 124, stroke = 10) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return { radius, circumference, strokeDashoffset: circumference - (percent / 100) * circumference };
}

function readStoredProfile() {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultProfile;
  }

  try {
    return { ...defaultProfile, ...JSON.parse(stored) } as ProfileState;
  } catch {
    return defaultProfile;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generatePortfolioUrl(name: string) {
  const slug = slugify(name || "student");
  return `https://hireups.ai/portfolio/${slug}`;
}

function computeLeetcodeSolved(username: string) {
  if (!username.trim()) {
    return 0;
  }

  const base = username.trim().length * 11;
  return Math.max(120, Math.min(640, base + 84));
}

function CompanyPills({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-zinc-300">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? "border-[#6666ff]/40 bg-[#6666ff]/15 text-white"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#0c0c16]/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-[#b8baff]">
            <Icon size={20} />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-white">{title}</h2>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EditableInput({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  suggestions,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  suggestions?: string[];
}) {
  const listId = suggestions ? `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-options` : undefined;

  return (
    <label className="space-y-1.5 text-sm">
      <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        list={listId}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#6666ff]/50 focus:bg-white/8"
      />
      {suggestions ? (
        <datalist id={listId}>
          {suggestions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      ) : null}
    </label>
  );
}

function EditableTextarea({
  label,
  value,
  onChange,
  onBlur,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  rows?: number;
}) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#6666ff]/50 focus:bg-white/8"
      />
    </label>
  );
}

function MetricCard({ label, value, helper, icon: Icon }: { label: string; value: string; helper: string; icon: LucideIcon }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between text-zinc-400">
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        <Icon size={16} />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <p className="mt-1 text-xs text-zinc-500">{helper}</p>
    </div>
  );
}

function SkillBar({ label, value, hint, color }: { label: string; value: number; hint: string; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-300">{label}</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <p className="text-[11px] text-zinc-500">{hint}</p>
    </div>
  );
}

export default function ProfilePageClient() {
  const [profile, setProfile] = useState<ProfileState>(defaultProfile);
  const [loaded, setLoaded] = useState(false);
  const [tagDraft, setTagDraft] = useState("");
  const [bannerText, setBannerText] = useState("Complete your academic info to improve profile quality.");
  const [bannerScore, setBannerScore] = useState(0);
  const [shareMessage, setShareMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const profileRef = useRef(profile);

  useEffect(() => {
    setProfile(readStoredProfile());
    setLoaded(true);
  }, []);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [loaded, profile]);

  const score = useMemo(() => {
    const hasAvatar = Boolean(profile.avatarUrl);
    const hasAcademic = [profile.academic.specialization, profile.academic.cgpa, profile.academic.twelfth, profile.academic.tenth, profile.academic.activeBacklogs, profile.academic.graduationYear].filter(Boolean).length;
    const preferencesFilled = [profile.preferences.targetRole, profile.preferences.minCTC, profile.preferences.workMode, profile.preferences.placementWindow].filter(Boolean).length + profile.preferences.targetCompanies.length + profile.preferences.preferredCities.length + Number(profile.preferences.relocation);
    const skillsFilled = profile.technical.tags.length + (profile.technical.dsa > 0 ? 1 : 0) + (profile.technical.systems > 0 ? 1 : 0) + (profile.technical.design > 0 ? 1 : 0);
    const linksFilled = [profile.links.githubHandle, profile.links.leetcodeUsername, profile.links.linkedinUrl, profile.links.portfolioUrl, profile.links.resumeName].filter(Boolean).length + Number(profile.links.githubConnected);
    const bioFilled = profile.bio.trim().length > 20 ? 1 : 0;
    const experienceScore = profile.experience.length > 0 ? 1 : 0;
    const projectsScore = profile.projects.length > 0 ? 1 : 0;

    const weighted =
      Number(hasAvatar) * 5 +
      Math.min(20, hasAcademic * 3) +
      Math.min(18, preferencesFilled * 2) +
      Math.min(18, skillsFilled * 2.5) +
      Math.min(16, linksFilled * 2) +
      bioFilled * 8 +
      experienceScore * 10 +
      projectsScore * 5;

    return clamp(Math.round(weighted));
  }, [profile]);

  useEffect(() => {
    const nextAction =
      profile.experience.length === 0
        ? { label: "Add internship", projected: 85 }
        : !profile.links.githubConnected
        ? { label: "Connect GitHub", projected: 90 }
        : profile.technical.tags.length < 7
        ? { label: "Add 2 more skill tags", projected: 93 }
        : profile.bio.length < 120
        ? { label: "Improve bio", projected: 96 }
        : { label: "Share profile", projected: 100 };

    setBannerText(`${nextAction.label} to reach ${nextAction.projected}%`);
    setBannerScore(nextAction.projected);
  }, [profile]);

  const technicalSkills = useMemo(() => {
    const dsa = SAMPLE_MASTERY.find((entry) => entry.topic === "DSA")?.percent ?? profile.technical.dsa;
    const systems = Math.round(
      (
        (SAMPLE_MASTERY.find((entry) => entry.topic === "OS")?.percent ?? 0) +
        (SAMPLE_MASTERY.find((entry) => entry.topic === "DBMS")?.percent ?? 0) +
        (SAMPLE_MASTERY.find((entry) => entry.topic === "OOP")?.percent ?? 0)
      ) / 3,
    );

    return [
      { label: "DSA", value: dsa, hint: "Pulled from the roadmap tracker", color: "bg-gradient-to-r from-[#6666ff] to-[#b8baff]" },
      { label: "OS + DBMS + OOP", value: systems, hint: "Average mastery from the DSA tracker", color: "bg-gradient-to-r from-[#b9f0d7] to-[#c9e8ff]" },
      { label: "System Design", value: profile.technical.design, hint: "Roadmap readiness for senior interview loops", color: "bg-gradient-to-r from-[#f0c9b9] to-[#b8baff]" },
    ];
  }, [profile.technical.design]);

  const handleBlur = () => {
    const snapshot = profileRef.current;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  };

  const updateProfile = <K extends keyof ProfileState>(key: K, value: ProfileState[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const updateAcademic = <K extends keyof ProfileState["academic"]>(key: K, value: ProfileState["academic"][K]) => {
    setProfile((current) => ({ ...current, academic: { ...current.academic, [key]: value } }));
  };

  const updatePreferences = <K extends keyof ProfileState["preferences"]>(key: K, value: ProfileState["preferences"][K]) => {
    setProfile((current) => ({ ...current, preferences: { ...current.preferences, [key]: value } }));
  };

  const updateLinks = <K extends keyof ProfileState["links"]>(key: K, value: ProfileState["links"][K]) => {
    setProfile((current) => ({ ...current, links: { ...current.links, [key]: value } }));
  };

  const toggleSelection = (key: "targetCompanies" | "preferredCities", option: string) => {
    setProfile((current) => {
      const list = current.preferences[key];
      const next = list.includes(option) ? list.filter((item) => item !== option) : [...list, option];
      return { ...current, preferences: { ...current.preferences, [key]: next } };
    });
  };

  const addSkillTag = (value: string) => {
    const normalized = value.trim();
    if (!normalized) {
      return;
    }

    setProfile((current) => {
      if (current.technical.tags.some((tag) => tag.toLowerCase() === normalized.toLowerCase())) {
        return current;
      }
      return { ...current, technical: { ...current.technical, tags: [...current.technical.tags, normalized] } };
    });
    setTagDraft("");
  };

  const removeSkillTag = (tag: string) => {
    setProfile((current) => ({
      ...current,
      technical: { ...current.technical, tags: current.technical.tags.filter((entry) => entry !== tag) },
    }));
  };

  const addExperience = () => {
    setProfile((current) => ({
      ...current,
      experience: [...current.experience, { company: "", role: "", team: "", duration: "" }],
    }));
  };

  const updateExperience = (index: number, key: keyof ExperienceEntry, value: string) => {
    setProfile((current) => ({
      ...current,
      experience: current.experience.map((entry, currentIndex) => (currentIndex === index ? { ...entry, [key]: value } : entry)),
    }));
  };

  const removeExperience = (index: number) => {
    setProfile((current) => ({
      ...current,
      experience: current.experience.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const updateProject = (index: number, key: keyof ProjectEntry, value: string | string[]) => {
    setProfile((current) => ({
      ...current,
      projects: current.projects.map((project, currentIndex) => (currentIndex === index ? { ...project, [key]: value } : project)),
    }));
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateProfile("avatarUrl", String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handleResumeUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    updateLinks("resumeName", file.name);
  };

  const handleConnectGitHub = () => {
    updateLinks("githubConnected", true);
  };

  const handleLeetcodeBlur = () => {
    const solved = computeLeetcodeSolved(profile.links.leetcodeUsername);
    updateLinks("leetcodeSolved", solved);
    updateLinks("portfolioUrl", generatePortfolioUrl(profile.name));
  };

  const improveBioWithAI = () => {
    setProfile((current) => ({
      ...current,
      bio: `Motivated ${current.branch} student targeting ${current.preferences.targetRole}, with hands-on project experience, strong DSA fundamentals, and a focus on building clean, production-ready systems that help teams ship faster.`,
    }));
  };

  const copyShareLink = async () => {
    const url = `${window.location.origin}/student/profile`;
    await navigator.clipboard.writeText(url);
    setShareMessage("Profile link copied to clipboard.");
    window.setTimeout(() => setShareMessage(""), 2500);
  };

  const skillSuggestions = useMemo(() => {
    if (!tagDraft.trim()) {
      return TAG_SUGGESTIONS.slice(0, 8);
    }

    const query = tagDraft.toLowerCase();
    return TAG_SUGGESTIONS.filter((tag) => tag.toLowerCase().includes(query)).slice(0, 8);
  }, [tagDraft]);

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const ring = progressRing(score, 132, 10);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <Link href="/student" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white">
          <ArrowLeft size={16} /> Back to Student Hub
        </Link>
        {shareMessage ? <span className="text-sm text-[#b9f0d7]">{shareMessage}</span> : null}
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-br from-[#0c0c16] via-[#10101e] to-[#0c0c16] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="absolute -left-10 top-0 h-52 w-52 rounded-full bg-[#6666ff]/15 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-[#b9f0d7]/10 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 text-white shadow-[0_20px_40px_rgba(0,0,0,0.28)] transition hover:border-[#6666ff]/40"
              >
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6666ff]/40 to-[#b9f0d7]/25 text-3xl font-bold tracking-widest">
                    {initials}
                  </div>
                )}
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/55 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">
                  <Camera size={12} /> Upload
                </span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#b9f0d7]/20 bg-[#b9f0d7]/10 px-3 py-1 text-xs font-semibold text-[#b9f0d7]">
                    <Trophy size={12} /> {profile.placementTrack}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#6666ff]/25 bg-[#6666ff]/12 px-3 py-1 text-xs font-semibold text-[#b8baff]">
                    <Zap size={12} /> {profile.streak}-day streak
                  </span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{profile.name}</h1>
                  <p className="text-base text-zinc-400 sm:text-lg">
                    {profile.college} · {profile.branch} · Class of {profile.gradYear}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-zinc-300">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Grad year {profile.gradYear}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{profile.academic.specialization}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{profile.preferences.targetRole}</span>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-zinc-400">
                  This profile acts as the single source of truth for roadmap personalization, portfolio generation, company matching, and recruiter discovery.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10">
                  <PencilLine size={16} /> Edit profile
                </button>
                <button type="button" onClick={copyShareLink} className="inline-flex items-center gap-2 rounded-2xl border border-[#6666ff]/30 bg-[#6666ff]/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6666ff]/25">
                  <Copy size={16} /> Share profile
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative flex items-center justify-center">
              <svg width={132} height={132} className="-rotate-90">
                <circle cx={66} cy={66} r={ring.radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
                <circle
                  cx={66}
                  cy={66}
                  r={ring.radius}
                  fill="none"
                  stroke="url(#profileRing)"
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray={ring.circumference}
                  strokeDashoffset={ring.strokeDashoffset}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="profileRing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6666ff" />
                    <stop offset="100%" stopColor="#b9f0d7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/20 backdrop-blur-sm">
                <span className="text-3xl font-bold text-white">{score}%</span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Profile complete</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 rounded-3xl border border-[#6666ff]/20 bg-[#6666ff]/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b8baff]">Next best action</p>
              <p className="mt-1 text-lg font-semibold text-white">{bannerText}</p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#b9f0d7]/20 bg-[#b9f0d7]/10 px-3 py-1.5 text-sm font-semibold text-[#b9f0d7]">
              <Sparkles size={14} /> Projected {bannerScore}% after next update
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Profile score" value={`${score}%`} helper="Feeds recruiter discovery and matching" icon={Target} />
        <MetricCard label="DSA problems solved" value={`${profile.links.leetcodeSolved || 184}`} helper="Synced from the roadmap tracker" icon={Trophy} />
        <MetricCard label="GitHub repos connected" value={profile.links.githubConnected ? "1" : "0"} helper="Syncs projects and portfolio activity" icon={GitBranch} />
        <MetricCard label="Applications sent" value="12" helper="Live ATS pipeline count" icon={Send} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Academic Info" icon={GraduationCap}>
          <div className="grid gap-4 sm:grid-cols-2">
            <EditableInput label="Branch" value={profile.branch} onChange={(value) => updateProfile("branch", value)} onBlur={handleBlur} />
            <EditableInput label="Specialisation" value={profile.academic.specialization} onChange={(value) => updateAcademic("specialization", value)} onBlur={handleBlur} />
            <EditableInput label="CGPA" value={profile.academic.cgpa} onChange={(value) => updateAcademic("cgpa", value)} onBlur={handleBlur} />
            <EditableInput label="12th %" value={profile.academic.twelfth} onChange={(value) => updateAcademic("twelfth", value)} onBlur={handleBlur} />
            <EditableInput label="10th %" value={profile.academic.tenth} onChange={(value) => updateAcademic("tenth", value)} onBlur={handleBlur} />
            <EditableInput label="Active backlogs" value={profile.academic.activeBacklogs} onChange={(value) => updateAcademic("activeBacklogs", value)} onBlur={handleBlur} />
            <EditableInput label="Graduation year" value={profile.academic.graduationYear} onChange={(value) => updateAcademic("graduationYear", value)} onBlur={handleBlur} />
          </div>
        </SectionCard>

        <SectionCard title="Placement Preferences" icon={Target}>
          <div className="grid gap-4 sm:grid-cols-2">
            <EditableInput label="Target role" value={profile.preferences.targetRole} suggestions={ROLE_OPTIONS} onChange={(value) => updatePreferences("targetRole", value)} onBlur={handleBlur} />
            <EditableInput label="Min expected CTC (LPA)" value={profile.preferences.minCTC} onChange={(value) => updatePreferences("minCTC", value)} onBlur={handleBlur} />
            <EditableInput label="Work mode" value={profile.preferences.workMode} suggestions={WORK_OPTIONS} onChange={(value) => updatePreferences("workMode", value)} onBlur={handleBlur} />
            <EditableInput label="Placement window" value={profile.preferences.placementWindow} suggestions={WINDOW_OPTIONS} onChange={(value) => updatePreferences("placementWindow", value)} onBlur={handleBlur} />
            <div className="sm:col-span-2">
              <CompanyPills title="Target companies" options={COMPANY_OPTIONS} selected={profile.preferences.targetCompanies} onToggle={(option) => toggleSelection("targetCompanies", option)} />
            </div>
            <div className="sm:col-span-2">
              <CompanyPills title="Preferred cities" options={CITY_OPTIONS} selected={profile.preferences.preferredCities} onToggle={(option) => toggleSelection("preferredCities", option)} />
            </div>
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 sm:col-span-2">
              <span className="font-semibold">Open to relocation</span>
              <button type="button" onClick={() => updatePreferences("relocation", !profile.preferences.relocation)} className={`relative h-7 w-12 rounded-full transition ${profile.preferences.relocation ? "bg-[#6666ff]" : "bg-white/10"}`}>
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${profile.preferences.relocation ? "left-6" : "left-1"}`} />
              </button>
            </label>
          </div>
        </SectionCard>

        <SectionCard title="Technical Skills" icon={GitBranch}>
          <div className="space-y-5">
            {technicalSkills.map((skill) => (
              <SkillBar key={skill.label} label={skill.label} value={skill.value} hint={skill.hint} color={skill.color} />
            ))}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Skill tags</p>
                  <p className="text-xs text-zinc-500">Autocomplete for languages, frameworks, and tools.</p>
                </div>
                <div className="relative w-full sm:max-w-sm">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input
                    value={tagDraft}
                    onChange={(event) => setTagDraft(event.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSkillTag(tagDraft);
                      }
                    }}
                    placeholder="Add a skill"
                    className="w-full rounded-2xl border border-white/10 bg-[#07070e] py-3 pl-10 pr-4 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {skillSuggestions
                  .filter((suggestion) => !profile.technical.tags.includes(suggestion))
                  .map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => addSkillTag(suggestion)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-[#6666ff]/40 hover:text-white"
                    >
                      + {suggestion}
                    </button>
                  ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {profile.technical.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-[#6666ff]/25 bg-[#6666ff]/10 px-3 py-1.5 text-xs font-semibold text-white">
                    {tag}
                    <button type="button" onClick={() => removeSkillTag(tag)} className="text-zinc-300 hover:text-white">
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Experience" icon={BriefcaseBusiness} action={<button type="button" onClick={addExperience} className="inline-flex items-center gap-2 rounded-full border border-[#6666ff]/25 bg-[#6666ff]/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#6666ff]/20"><CirclePlus size={14} /> Add</button>}>
          {profile.experience.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm font-semibold text-white">No internship or work experience added yet.</p>
              <p className="mt-1 text-sm text-zinc-500">Add your first internship to unlock stronger recruiter matching.</p>
              <button type="button" onClick={addExperience} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#6666ff] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7e7eff]">
                <CirclePlus size={16} /> Add internship
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {profile.experience.map((entry, index) => (
                <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Experience {index + 1}</p>
                    <button type="button" onClick={() => removeExperience(index)} className="text-zinc-500 transition hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <EditableInput label="Company" value={entry.company} onChange={(value) => updateExperience(index, "company", value)} onBlur={handleBlur} />
                    <EditableInput label="Role" value={entry.role} onChange={(value) => updateExperience(index, "role", value)} onBlur={handleBlur} />
                    <EditableInput label="Team" value={entry.team} onChange={(value) => updateExperience(index, "team", value)} onBlur={handleBlur} />
                    <EditableInput label="Duration" value={entry.duration} onChange={(value) => updateExperience(index, "duration", value)} onBlur={handleBlur} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Projects" icon={Rocket} action={<button type="button" onClick={() => updateProfile("projects", [...defaultProjects])} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:text-white"><RefreshIcon /> Sync from GitHub</button>}>
          <div className="space-y-4">
            {profile.projects.map((project, index) => (
              <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Project {index + 1}</p>
                    <p className="text-xs text-zinc-500">Manually overridable even when GitHub sync is connected.</p>
                  </div>
                </div>
                <div className="grid gap-4">
                  <EditableInput label="Project name" value={project.name} onChange={(value) => updateProject(index, "name", value)} onBlur={handleBlur} />
                  <EditableTextarea label="Description" value={project.description} onChange={(value) => updateProject(index, "description", value)} onBlur={handleBlur} rows={3} />
                  <EditableInput label="Impact metric" value={project.impact} onChange={(value) => updateProject(index, "impact", value)} onBlur={handleBlur} />
                  <label className="space-y-1.5 text-sm">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Tech tags</span>
                    <input
                      value={project.tags.join(", ")}
                      onChange={(event) => updateProject(index, "tags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))}
                      onBlur={handleBlur}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#6666ff]/50 focus:bg-white/8"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-zinc-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Links" icon={Link2}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">GitHub</p>
                  <p className="text-xs text-zinc-500">OAuth connection unlocks project syncing and profile enrichment.</p>
                </div>
                <button type="button" onClick={handleConnectGitHub} className="inline-flex items-center gap-2 rounded-2xl bg-[#6666ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7d7dff]">
                  <GitBranch size={16} /> {profile.links.githubConnected ? "Connected" : "Connect"}
                </button>
              </div>
              <EditableInput label="GitHub username" value={profile.links.githubHandle} onChange={(value) => updateLinks("githubHandle", value)} onBlur={() => { handleBlur(); updateLinks("portfolioUrl", generatePortfolioUrl(profile.name)); }} />
            </div>
            <EditableInput label="LeetCode username" value={profile.links.leetcodeUsername} onChange={(value) => updateLinks("leetcodeUsername", value)} onBlur={handleLeetcodeBlur} />
            <EditableInput label="LinkedIn URL" value={profile.links.linkedinUrl} onChange={(value) => updateLinks("linkedinUrl", value)} onBlur={handleBlur} />
            <label className="space-y-1.5 text-sm sm:col-span-2">
              <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Portfolio URL</span>
              <input
                value={profile.links.portfolioUrl}
                onChange={(event) => updateLinks("portfolioUrl", event.target.value)}
                onBlur={handleBlur}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#6666ff]/50 focus:bg-white/8"
              />
              <p className="mt-1 text-xs text-zinc-500">Auto-filled from your profile, but you can override it.</p>
            </label>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">Resume PDF</p>
                  <p className="text-xs text-zinc-500">Upload the latest version for recruiter export flows.</p>
                </div>
                <button type="button" onClick={() => resumeInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#6666ff]/40">
                  <FileUp size={16} /> Upload
                </button>
              </div>
              <input ref={resumeInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} />
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-zinc-300">
                <FileUp size={12} /> {profile.links.resumeName || "No resume uploaded"}
              </div>
            </div>

            {profile.links.githubConnected ? (
              <div className="rounded-3xl border border-[#b9f0d7]/20 bg-[#b9f0d7]/10 p-4 sm:col-span-2">
                <p className="text-sm font-semibold text-[#b9f0d7]">GitHub connected</p>
                <p className="mt-1 text-sm text-zinc-300">Portfolio sync can now surface recent repositories automatically.</p>
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard title="About / Bio" icon={HeartHandshake} action={<button type="button" onClick={improveBioWithAI} className="inline-flex items-center gap-2 rounded-full border border-[#6666ff]/25 bg-[#6666ff]/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#6666ff]/20"><Sparkles size={14} /> Improve with AI</button>}>
          <EditableTextarea label="Bio" value={profile.bio} onChange={(value) => updateProfile("bio", value)} onBlur={handleBlur} rows={5} />
          <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
            Recruiter-facing tone, concise outcomes, and a clear target role help this section perform better in matching.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function RefreshIcon() {
  return <ArrowRight size={12} className="rotate-[-45deg]" />;
}