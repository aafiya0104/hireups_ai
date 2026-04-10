'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle2, Circle, ChevronRight, Flame, Zap, AlertTriangle,
  X, RefreshCw, ArrowRight, Clock, MapPin, Star, Focus, BarChart3,
} from 'lucide-react';
import {
  SAMPLE_WEEK_CALENDAR, SAMPLE_TASKS, SAMPLE_MASTERY,
  Task, CalendarDay, getLevel, getNextLevel,
} from '@/lib/roadmap-data';

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_XP = 1240;
const STREAK = 7;
const OVERALL_PROGRESS = 34;

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ percent, size = 80, stroke = 8, color = '#6666ff' }: {
  percent: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ strokeDasharray: circ }}
      />
    </svg>
  );
}

// ─── Streak Flame ─────────────────────────────────────────────────────────────
function StreakFlame({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [1, 0.8, 1] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className="text-2xl"
      >
        🔥
      </motion.div>
      <div>
        <p className="text-xl font-bold font-heading text-white leading-none">{count}</p>
        <p className="text-[10px] text-zinc-400 uppercase tracking-wider">day streak</p>
      </div>
    </div>
  );
}

// ─── Week calendar strip ──────────────────────────────────────────────────────
function WeekStrip({ days }: { days: CalendarDay[] }) {
  const colors: Record<string, string> = {
    done: 'bg-[#b9f0d7] text-zinc-900',
    active: 'bg-[#6666ff] text-white shadow-[0_0_12px_rgba(102,102,255,0.5)]',
    upcoming: 'bg-zinc-800 text-zinc-400',
    missed: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };
  const dotColors: Record<string, string> = {
    done: 'bg-[#b9f0d7]', active: 'bg-[#6666ff]', upcoming: 'bg-zinc-600', missed: 'bg-red-400',
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {days.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl min-w-[60px] cursor-pointer transition-all hover:scale-105 ${colors[d.status]}`}
        >
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">{d.date}</span>
          <span className="text-lg font-bold font-heading leading-none">{d.day}</span>
          {d.status !== 'upcoming' && (
            <div className="flex gap-0.5">
              {Array.from({ length: d.tasksTotal }).map((_, ti) => (
                <div key={ti} className={`w-1.5 h-1.5 rounded-full ${ti < d.tasksDone ? dotColors[d.status] : 'bg-white/20'}`} />
              ))}
            </div>
          )}
          {d.status === 'upcoming' && (
            <span className="text-[9px] opacity-50">{d.tasksTotal} tasks</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Task row ─────────────────────────────────────────────────────────────────
function TaskRow({
  task, onToggle, onTooHard, xpFloat,
}: { task: Task; onToggle: (id: string) => void; onTooHard: (id: string) => void; xpFloat: string | null }) {
  const diffColor = { Easy: 'text-[#b9f0d7] bg-[#b9f0d7]/10', Medium: 'text-[#f0e5b9] bg-[#f0e5b9]/10', Hard: 'text-red-400 bg-red-400/10' };
  const topicColors: Record<string, string> = {
    DSA: '#6666ff', OS: '#b9f0d7', DBMS: '#c9e8ff', OOP: '#b8baff',
    'System Design': '#f0c9b9', Aptitude: '#f0e5b9', CN: '#b9d4f0',
  };
  const topicColor = topicColors[task.topic] ?? '#6666ff';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all ${
        task.completed
          ? 'border-white/5 bg-zinc-900/30 opacity-60'
          : 'border-white/5 bg-zinc-900/50 hover:border-white/15'
      }`}
    >
      {/* XP float animation */}
      <AnimatePresence>
        {xpFloat === task.id && (
          <motion.span
            key="xp"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute top-2 right-4 text-[#b9f0d7] text-sm font-bold pointer-events-none"
          >
            +{task.xp} XP ✨
          </motion.span>
        )}
      </AnimatePresence>

      {/* Checkbox */}
      <button onClick={() => onToggle(task.id)} className="mt-0.5 flex-shrink-0">
        {task.completed ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle2 size={22} className="text-[#b9f0d7]" />
          </motion.div>
        ) : (
          <Circle size={22} className="text-zinc-600 hover:text-[#6666ff] transition-colors" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${task.completed ? 'line-through text-zinc-500' : 'text-white'}`}>
          {task.title}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={{ color: topicColor, background: `${topicColor}18` }}
          >
            {task.topic}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffColor[task.difficulty]}`}>
            {task.difficulty}
          </span>
          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
            <Clock size={10} /> {task.estimatedMinutes} min
          </span>
          <span className="text-[10px] text-[#6666ff] flex items-center gap-1">
            <Zap size={10} /> {task.xp} XP
          </span>
        </div>
      </div>

      {/* Too hard menu */}
      {!task.completed && (
        <button
          onClick={() => onTooHard(task.id)}
          className="text-zinc-600 hover:text-red-400 transition-colors text-xs mt-0.5 flex-shrink-0"
          title="Mark as too hard"
        >
          Too hard?
        </button>
      )}
    </motion.div>
  );
}

// ─── Mastery sidebar ──────────────────────────────────────────────────────────
function MasterySidebar({ xp, streak, progress }: { xp: number; streak: number; progress: number }) {
  const level = getLevel(xp);
  const next = getNextLevel(xp);
  const levelPct = next
    ? Math.round(((xp - level.minXP) / (next.minXP - level.minXP)) * 100)
    : 100;

  return (
    <div className="space-y-4">
      {/* Level card */}
      <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Your Level</p>
            <p className="text-lg font-bold font-heading" style={{ color: level.color }}>{level.level}</p>
          </div>
          <div className="relative">
            <ProgressRing percent={progress} size={70} stroke={7} color="#6666ff" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{progress}%</span>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>{xp} XP</span>
            {next && <span>{next.minXP} XP</span>}
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${levelPct}%` }}
              transition={{ duration: 1 }}
              className="h-full rounded-full"
              style={{ background: level.color }}
            />
          </div>
          {next && (
            <p className="text-[10px] text-zinc-500">{next.minXP - xp} XP to {next.level}</p>
          )}
        </div>
      </div>

      {/* Streak */}
      <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
        <StreakFlame count={streak} />
        <p className="text-xs text-zinc-500 mt-2 font-sans">Keep it going — don't break the chain!</p>
      </div>

      {/* Topic Mastery Bars */}
      <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-4">Topic Mastery</p>
        <div className="space-y-3">
          {SAMPLE_MASTERY.map((m) => (
            <div key={m.topic}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-medium">{m.topic}</span>
                <span className="font-bold" style={{ color: m.color }}>{m.percent}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ background: m.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/student/roadmap/focus" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#6666ff]/10 border border-[#6666ff]/20 hover:bg-[#6666ff]/20 transition-all">
          <Focus size={20} className="text-[#6666ff]" />
          <span className="text-xs font-bold text-white">Focus Mode</span>
        </Link>
        <Link href="/student/roadmap/timeline" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#b9f0d7]/10 border border-[#b9f0d7]/20 hover:bg-[#b9f0d7]/20 transition-all">
          <BarChart3 size={20} className="text-[#b9f0d7]" />
          <span className="text-xs font-bold text-white">Full Timeline</span>
        </Link>
      </div>
    </div>
  );
}

// ─── Missed Day Modal ─────────────────────────────────────────────────────────
function MissedDayModal({ onClose }: { onClose: () => void }) {
  const [chosen, setChosen] = useState<string | null>(null);

  const options = [
    { id: 'skip', icon: '⏭', label: 'Skip it', desc: 'Remove Wednesday\'s tasks permanently.' },
    { id: 'catchup', icon: '🏃', label: 'Catch up today', desc: 'Add missed tasks to today\'s list.' },
    { id: 'redistribute', icon: '📆', label: 'Redistribute across the week', desc: 'Spread missed tasks across Fri–Sun.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
          <X size={20} />
        </button>
        <div className="flex items-center gap-3 mb-5">
          <AlertTriangle size={20} className="text-[#f0e5b9]" />
          <div>
            <h3 className="font-bold text-white font-heading">Missed day detected</h3>
            <p className="text-xs text-zinc-400">Wednesday had 3 uncompleted tasks.</p>
          </div>
        </div>
        <div className="space-y-3 mb-5">
          {options.map((opt) => (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setChosen(opt.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                chosen === opt.id
                  ? 'border-[#6666ff] bg-[#6666ff]/10'
                  : 'border-white/5 bg-zinc-800 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{opt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-white">{opt.label}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{opt.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        <button
          onClick={onClose}
          disabled={!chosen}
          className="w-full py-3 rounded-xl bg-[#6666ff] text-white font-bold disabled:opacity-40 hover:bg-[#b8baff] hover:text-zinc-900 transition-all"
        >
          Apply & Update Schedule
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── AI Reroute Banner ────────────────────────────────────────────────────────
function RerouteBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#6666ff]/10 border border-[#6666ff]/30 mb-4">
        <RefreshCw size={16} className="text-[#b8baff] mt-0.5 flex-shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
        <div className="flex-1 text-sm font-sans">
          <p className="font-bold text-[#b8baff]">AI rerouted your plan ✨</p>
          <p className="text-zinc-400 text-xs mt-1">
            You crushed Arrays 2 days early! DP basics moved forward from Week 4 to Week 3. OS review inserted Friday.
          </p>
        </div>
        <button onClick={onDismiss} className="text-zinc-500 hover:text-white flex-shrink-0">
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Placement pacing header ──────────────────────────────────────────────────
function PacingHeader() {
  const pacing = 'On track';
  const pacingColor = { 'On track': 'text-[#b9f0d7] bg-[#b9f0d7]/10 border-[#b9f0d7]/30', 'Slightly behind': 'text-[#f0e5b9] bg-[#f0e5b9]/10 border-[#f0e5b9]/30', 'At risk': 'text-red-400 bg-red-400/10 border-red-400/30' };

  return (
    <div className="flex items-center justify-between bg-zinc-900/60 border border-white/5 rounded-xl px-4 py-3 mb-6">
      <div className="flex items-center gap-2">
        <MapPin size={14} className="text-zinc-400" />
        <span className="text-sm text-zinc-300 font-sans">
          <strong className="text-white">73 days</strong> to placement season
        </span>
      </div>
      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${pacingColor[pacing as keyof typeof pacingColor]}`}>
        {pacing} ✓
      </span>
    </div>
  );
}

// ─── Peer benchmarking panel ──────────────────────────────────────────────────
function PeerBenchmark() {
  return (
    <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 mt-4">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-3">Anonymous Batch Snapshot</p>
      <div className="space-y-2">
        {[
          { label: 'Avg. batch progress', value: '28%', color: 'bg-zinc-600' },
          { label: 'You', value: '34%', color: 'bg-[#6666ff]' },
          { label: 'Top 10%', value: '58%', color: 'bg-[#b9f0d7]' },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-zinc-400">{row.label}</span>
                <span className="text-white font-bold">{row.value}</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${row.color}`} style={{ width: row.value }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-zinc-500 mt-2">You're in the top 30% of your batch 🎉</p>
    </div>
  );
}

// ─── Friday check-in ──────────────────────────────────────────────────────────
function FridayCheckin({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState<number | null>(null);
  const EMOJIS = ['😓', '😕', '😐', '😊', '🚀'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        <X size={16} className="absolute top-4 right-4 text-zinc-500 cursor-pointer hover:text-white" onClick={onClose} />
        <h3 className="font-bold text-white font-heading text-lg mb-1">Weekly Check-in 📋</h3>
        <p className="text-xs text-zinc-400 mb-5 font-sans">How tough was this week? AI will calibrate next week's intensity.</p>
        <div className="flex justify-between mb-6">
          {EMOJIS.map((e, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(i + 1)}
              className={`text-3xl p-2 rounded-xl transition-all ${rating === i + 1 ? 'bg-[#6666ff]/20 ring-2 ring-[#6666ff]' : 'hover:bg-white/5'}`}
            >
              {e}
            </motion.button>
          ))}
        </div>
        <button
          onClick={onClose}
          disabled={!rating}
          className="w-full py-2.5 rounded-xl bg-[#6666ff] text-white font-bold text-sm disabled:opacity-40 hover:bg-[#b8baff] hover:text-zinc-900 transition-all"
        >
          Submit & Calibrate Week 4
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function RoadmapDashboard() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [showMissedModal, setShowMissedModal] = useState(true);
  const [showReroute, setShowReroute] = useState(true);
  const [showCheckin, setShowCheckin] = useState(false);
  const [xpFloat, setXpFloat] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    );
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      setXpFloat(id);
      setTimeout(() => setXpFloat(null), 1000);
    }
  };

  const handleTooHard = (id: string) => {
    // In a real app: split into sub-tasks, insert prereqs
    alert('AI is splitting this into smaller sub-tasks and inserting prerequisites. (Mocked)');
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top pacing bar */}
      <PacingHeader />

      {/* AI Reroute banner */}
      <AnimatePresence>
        {showReroute && <RerouteBanner onDismiss={() => setShowReroute(false)} />}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">AI Learning Roadmap</h1>
          <p className="text-zinc-400 text-sm mt-1 font-sans">Week 3 of 12 · <span className="text-[#b8baff]">Trees & Recursion</span></p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCheckin(true)}
            className="px-4 py-2 text-sm font-bold border border-[#f0e5b9]/30 text-[#f0e5b9] rounded-lg hover:bg-[#f0e5b9]/10 transition-all"
          >
            📋 Weekly Check-in
          </button>
          <Link href="/student/roadmap/timeline" className="px-4 py-2 text-sm font-bold bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-1.5">
            Full Roadmap <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Week calendar */}
      <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5 mb-6">
        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-4">This Week</p>
        <WeekStrip days={SAMPLE_WEEK_CALENDAR} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main — today's tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white font-heading">Today's Tasks</h2>
            <span className="text-xs text-zinc-400">{completedCount}/{tasks.length} done</span>
          </div>

          {/* Progress mini-bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
              className="h-full bg-[#6666ff] rounded-full"
              transition={{ duration: 0.4 }}
            />
          </div>

          {tasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onToggle={handleToggle}
              onTooHard={handleTooHard}
              xpFloat={xpFloat}
            />
          ))}

          {/* Focus mode CTA */}
          <Link
            href="/student/roadmap/focus"
            className="flex items-center justify-between w-full p-4 rounded-xl border border-[#6666ff]/20 bg-[#6666ff]/5 hover:bg-[#6666ff]/10 transition-all mt-2"
          >
            <div className="flex items-center gap-3">
              <Star size={18} className="text-[#6666ff]" />
              <div>
                <p className="text-sm font-bold text-white">Enter Focus Mode</p>
                <p className="text-xs text-zinc-400">Distraction-free Pomodoro session</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-[#6666ff]" />
          </Link>
        </div>

        {/* Sidebar */}
        <div>
          <MasterySidebar xp={TOTAL_XP} streak={STREAK} progress={OVERALL_PROGRESS} />
          <PeerBenchmark />
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showMissedModal && <MissedDayModal onClose={() => setShowMissedModal(false)} />}
        {showCheckin && <FridayCheckin onClose={() => setShowCheckin(false)} />}
      </AnimatePresence>
    </div>
  );
}
