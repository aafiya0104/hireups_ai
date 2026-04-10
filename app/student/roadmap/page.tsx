'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle2, Circle, ChevronRight, Zap, AlertTriangle, X, RefreshCw,
  ArrowRight, Clock, MapPin, Star, Focus, BarChart3, Bell, CalendarDays,
  ListChecks, ChevronLeft, ShieldAlert, TrendingUp, BookOpen,
} from 'lucide-react';
import {
  SAMPLE_WEEK_CALENDAR, SAMPLE_TASKS, SAMPLE_MASTERY,
  Task, CalendarDay, getLevel, getNextLevel,
} from '@/lib/roadmap-data';

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_XP   = 1240;
const STREAK     = 7;
const OVERALL_PROGRESS = 34;
const SESSION_KEY = 'hireups_missed_modal_shown';

// ─── Notifications data ────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, type: 'reroute', icon: '✨', title: 'AI rerouted your plan',      body: 'Trees moved to today. DP pushed to Week 4.', time: '2h ago', read: false },
  { id: 2, type: 'warn',    icon: '🔥', title: 'Streak at risk!',            body: 'Complete today\'s tasks to keep your 7-day streak.', time: '4h ago', read: false },
  { id: 3, type: 'checkin', icon: '📋', title: 'Weekly check-in due',        body: 'Friday prompt: rate this week\'s difficulty.', time: '6h ago', read: true },
  { id: 4, type: 'info',    icon: '📈', title: 'Batch rank improved!',        body: 'You\'re now in the top 28% of your batch.', time: '1d ago', read: true },
  { id: 5, type: 'review',  icon: '🔁', title: 'Revision session due',       body: 'Arrays hit the 7-day spaced-repetition mark.', time: '1d ago', read: true },
  { id: 6, type: 'info',    icon: '🏆', title: 'New personal best!',          body: 'Completed 4 tasks in a single session. 80 XP earned.', time: '2d ago', read: true },
];

// ─── Calendar day data (mock full month) ──────────────────────────────────────
type DayCal = { date: number; status: 'done' | 'missed' | 'active' | 'upcoming' | 'empty'; tasks: number };

function buildMonthCalendar(month: number, year: number): DayCal[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const statuses: ('done' | 'missed' | 'active' | 'upcoming')[] = [
    'done','done','done','missed','done','done','done',
    'done','done','missed','done','active','upcoming','upcoming',
    'upcoming','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming',
    'upcoming','upcoming','upcoming','upcoming','upcoming','upcoming','upcoming',
  ];
  const calendar: DayCal[] = [];
  for (let i = 0; i < firstDay; i++) calendar.push({ date: 0, status: 'empty', tasks: 0 });
  for (let d = 1; d <= daysInMonth; d++) {
    calendar.push({
      date: d,
      status: statuses[d - 1] ?? 'upcoming',
      tasks: Math.floor(Math.random() * 3) + 2,
    });
  }
  return calendar;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ percent, size = 80, stroke = 8, color = '#6666ff' }: {
  percent: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (percent / 100) * circ }}
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
      <motion.span
        animate={{ scale: [1, 1.18, 1], opacity:[1, 0.75, 1] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="text-2xl select-none"
      >🔥</motion.span>
      <div>
        <p className="text-xl font-bold font-heading text-white leading-none">{count}</p>
        <p className="text-[10px] text-zinc-400 uppercase tracking-wider">day streak</p>
      </div>
    </div>
  );
}

// ─── Week Strip ───────────────────────────────────────────────────────────────
function WeekStrip({ days }: { days: CalendarDay[] }) {
  const cls: Record<string, string> = {
    done:     'bg-[#b9f0d7] text-zinc-900',
    active:   'bg-[#6666ff] text-white ring-2 ring-[#6666ff]/40',
    upcoming: 'bg-zinc-800 text-zinc-400',
    missed:   'bg-red-500/20 text-red-400 border border-red-500/40',
  };
  const dot: Record<string, string> = {
    done:'bg-zinc-900', active:'bg-white', upcoming:'bg-zinc-600', missed:'bg-red-400',
  };
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      {days.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-2.5 py-2.5 rounded-xl min-w-[56px] cursor-pointer hover:scale-105 transition-all select-none ${cls[d.status]}`}
        >
          <span className="text-[9px] uppercase tracking-wider font-bold opacity-60">{d.date}</span>
          <span className="text-base font-bold font-heading leading-none">{d.day}</span>
          <div className="flex gap-0.5">
            {Array.from({ length: d.tasksTotal }).map((_, ti) => (
              <div key={ti} className={`w-1.5 h-1.5 rounded-full ${ti < d.tasksDone ? dot[d.status] : 'bg-white/20'}`} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Task Row ─────────────────────────────────────────────────────────────────
const TOPIC_COLORS: Record<string, string> = {
  DSA:'#6666ff', OS:'#b9f0d7', DBMS:'#c9e8ff', OOP:'#b8baff',
  'System Design':'#f0c9b9', Aptitude:'#f0e5b9', CN:'#b9d4f0',
};
const DIFF_COLORS: Record<string, string> = {
  Easy:'text-[#b9f0d7] bg-[#b9f0d7]/10', Medium:'text-[#f0e5b9] bg-[#f0e5b9]/10', Hard:'text-red-400 bg-red-400/10',
};

function TaskRow({ task, onToggle, onTooHard, xpFloat }: {
  task: Task; onToggle: (id: string) => void; onTooHard: (id: string) => void; xpFloat: string | null;
}) {
  const tc = TOPIC_COLORS[task.topic] ?? '#6666ff';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex items-start gap-3 p-4 rounded-xl border transition-all ${
        task.completed ? 'border-white/5 bg-zinc-900/30 opacity-55' : 'border-white/5 bg-zinc-900/50 hover:border-white/15 hover:bg-zinc-900/70'
      }`}
    >
      <AnimatePresence>
        {xpFloat === task.id && (
          <motion.span key="xp" initial={{ opacity:1, y:0 }} animate={{ opacity:0, y:-36 }} exit={{ opacity:0 }} transition={{ duration:0.9 }}
            className="absolute top-2 right-3 text-[#b9f0d7] text-xs font-bold pointer-events-none z-10">
            +{task.xp} XP ✨
          </motion.span>
        )}
      </AnimatePresence>
      <button onClick={() => onToggle(task.id)} className="mt-0.5 flex-shrink-0 touch-manipulation">
        {task.completed
          ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={20} className="text-[#b9f0d7]" /></motion.div>
          : <Circle size={20} className="text-zinc-600 hover:text-[#6666ff] transition-colors" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-snug ${task.completed ? 'line-through text-zinc-500' : 'text-white'}`}>
          {task.title}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ color: tc, background: `${tc}18` }}>{task.topic}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFF_COLORS[task.difficulty]}`}>{task.difficulty}</span>
          <span className="text-[10px] text-zinc-500 flex items-center gap-0.5"><Clock size={9} /> {task.estimatedMinutes}m</span>
          <span className="text-[10px] text-[#6666ff] flex items-center gap-0.5"><Zap size={9} /> {task.xp} XP</span>
        </div>
      </div>
      {!task.completed && (
        <button onClick={() => onTooHard(task.id)} className="text-zinc-600 hover:text-red-400 transition-colors text-[10px] mt-0.5 flex-shrink-0 font-medium">
          Too hard?
        </button>
      )}
    </motion.div>
  );
}

// ─── Calendar View ────────────────────────────────────────────────────────────
function CalendarView() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState<DayCal | null>(null);

  const days = buildMonthCalendar(month, year);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const cellColors: Record<string, string> = {
    done:     'bg-[#b9f0d7]/20 text-[#b9f0d7] border-[#b9f0d7]/20 hover:bg-[#b9f0d7]/30',
    active:   'bg-[#6666ff]/20 text-[#6666ff] border-[#6666ff]/30 hover:bg-[#6666ff]/30 ring-2 ring-[#6666ff]/30',
    missed:   'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
    upcoming: 'bg-zinc-800/60 text-zinc-400 border-white/5 hover:bg-zinc-700/60',
    empty:    'bg-transparent border-transparent',
  };

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prev} className="p-2 rounded-lg hover:bg-white/5 transition-all text-zinc-400 hover:text-white">
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-heading font-bold text-white">{MONTHS[month]} {year}</h3>
        <button onClick={next} className="p-2 rounded-lg hover:bg-white/5 transition-all text-zinc-400 hover:text-white">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-[10px] text-zinc-500 font-bold uppercase py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <motion.button
            key={i}
            whileHover={d.status !== 'empty' ? { scale: 1.08 } : {}}
            whileTap={d.status !== 'empty' ? { scale: 0.94 } : {}}
            onClick={() => d.status !== 'empty' && setSelectedDay(selectedDay?.date === d.date ? null : d)}
            className={`aspect-square rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${cellColors[d.status]} ${selectedDay?.date === d.date ? 'ring-2 ring-white/30' : ''}`}
          >
            {d.status !== 'empty' && (
              <>
                <span>{d.date}</span>
                {d.status !== 'upcoming' && (
                  <div className="flex gap-[2px]">
                    {Array.from({ length: Math.min(d.tasks, 4) }).map((_, ti) => (
                      <div key={ti} className="w-1 h-1 rounded-full opacity-60 bg-current" />
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.button>
        ))}
      </div>

      {/* Day detail */}
      <AnimatePresence>
        {selectedDay && selectedDay.status !== 'empty' && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`p-4 rounded-xl border ${cellColors[selectedDay.status]} mt-2`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-sm">{MONTHS[month]} {selectedDay.date}</p>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-current/10`}>
                  {selectedDay.status}
                </span>
              </div>
              <p className="text-xs opacity-70">
                {selectedDay.status === 'done'     && `All ${selectedDay.tasks} tasks completed ✓`}
                {selectedDay.status === 'missed'   && `${selectedDay.tasks} tasks missed — click "Catch up" to recover.`}
                {selectedDay.status === 'active'   && `${selectedDay.tasks} tasks scheduled · in progress now.`}
                {selectedDay.status === 'upcoming' && `${selectedDay.tasks} tasks planned for this day.`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-1">
        {[
          { label:'Done', color:'bg-[#b9f0d7]/30 border-[#b9f0d7]/30' },
          { label:'Active', color:'bg-[#6666ff]/30 border-[#6666ff]/30' },
          { label:'Missed', color:'bg-red-500/20 border-red-500/20' },
          { label:'Upcoming', color:'bg-zinc-700 border-white/10' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <div className={`w-3 h-3 rounded-sm border ${s.color}`} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Notifications Panel ──────────────────────────────────────────────────────
function NotificationsPanel({ onMarkAll }: { onMarkAll: () => void }) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const typeColor: Record<string, string> = {
    reroute: 'text-[#b8baff] bg-[#b8baff]/10 border-[#b8baff]/20',
    warn:    'text-[#f0e5b9] bg-[#f0e5b9]/10 border-[#f0e5b9]/20',
    checkin: 'text-[#c9e8ff] bg-[#c9e8ff]/10 border-[#c9e8ff]/20',
    review:  'text-[#b9f0d7] bg-[#b9f0d7]/10 border-[#b9f0d7]/20',
    info:    'text-zinc-300 bg-zinc-700/30 border-white/10',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Notifications</p>
        <button onClick={onMarkAll} className="text-[10px] text-[#6666ff] hover:underline">Mark all read</button>
      </div>
      {notifs.map((n, i) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => markRead(n.id)}
          className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:border-white/20 ${n.read ? 'bg-zinc-900/30 border-white/5 opacity-60' : `${typeColor[n.type]} border`}`}
        >
          <span className="text-xl flex-shrink-0 leading-none">{n.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-white leading-snug">{n.title}</p>
              {!n.read && <div className="w-2 h-2 rounded-full bg-[#6666ff] flex-shrink-0 mt-1" />}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{n.body}</p>
            <p className="text-[10px] text-zinc-600 mt-1">{n.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Mastery Sidebar ──────────────────────────────────────────────────────────
function MasterySidebar({ xp, streak, progress }: { xp: number; streak: number; progress: number }) {
  const level = getLevel(xp);
  const next  = getNextLevel(xp);
  const lvlPct = next ? Math.round(((xp - level.minXP) / (next.minXP - level.minXP)) * 100) : 100;
  return (
    <div className="space-y-4">
      {/* Level */}
      <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Your Level</p>
            <p className="text-lg font-bold font-heading" style={{ color: level.color }}>{level.level}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{xp.toLocaleString()} XP total</p>
          </div>
          <div className="relative">
            <ProgressRing percent={progress} size={68} stroke={6} color="#6666ff" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{progress}%</span>
            </div>
          </div>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
          <motion.div animate={{ width: `${lvlPct}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: level.color }} />
        </div>
        {next && <p className="text-[10px] text-zinc-500">{(next.minXP - xp).toLocaleString()} XP to <strong className="text-zinc-300">{next.level}</strong></p>}
      </div>

      {/* Streak */}
      <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
        <StreakFlame count={streak} />
        <p className="text-xs text-zinc-500 mt-2">Don't break the chain! Next milestone at 10 days.</p>
        <div className="flex gap-1 mt-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full ${i < streak ? 'bg-orange-400' : 'bg-white/5'}`} />
          ))}
        </div>
      </div>

      {/* Mastery bars */}
      <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-4">Topic Mastery</p>
        <div className="space-y-3">
          {SAMPLE_MASTERY.map((m) => (
            <div key={m.topic}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300">{m.topic}</span>
                <span className="font-bold" style={{ color: m.color }}>{m.percent}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${m.percent}%` }} transition={{ duration: 0.8, delay: 0.1 }}
                  className="h-full rounded-full" style={{ background: m.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-2">
        <Link href="/student/roadmap/focus" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#6666ff]/10 border border-[#6666ff]/20 hover:bg-[#6666ff]/20 transition-all">
          <Focus size={18} className="text-[#6666ff]" />
          <span className="text-[10px] font-bold text-white">Focus Mode</span>
        </Link>
        <Link href="/student/roadmap/timeline" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#b9f0d7]/10 border border-[#b9f0d7]/20 hover:bg-[#b9f0d7]/20 transition-all">
          <BarChart3 size={18} className="text-[#b9f0d7]" />
          <span className="text-[10px] font-bold text-white">Timeline</span>
        </Link>
      </div>
    </div>
  );
}

// ─── Missed Day Modal ─────────────────────────────────────────────────────────
function MissedDayModal({ onClose }: { onClose: () => void }) {
  const [chosen, setChosen] = useState<string | null>(null);
  const opts = [
    { id:'skip',         icon:'⏭', label:'Skip it',                     desc:'Remove Wednesday\'s tasks permanently.' },
    { id:'catchup',      icon:'🏃', label:'Catch up today',               desc:'Add missed tasks to today\'s list.' },
    { id:'redistribute', icon:'📆', label:'Redistribute across the week', desc:'Spread missed tasks across Fri–Sun.' },
  ];
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ y:80, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:80, opacity:0 }}
        transition={{ type:'spring', damping:26 }}
        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={18} /></button>
        <div className="flex items-center gap-3 mb-5">
          <AlertTriangle size={20} className="text-[#f0e5b9] flex-shrink-0" />
          <div>
            <h3 className="font-bold text-white font-heading">Missed day detected</h3>
            <p className="text-xs text-zinc-400">Wednesday had 3 uncompleted tasks.</p>
          </div>
        </div>
        <div className="space-y-2 mb-5">
          {opts.map(opt => (
            <motion.button key={opt.id} whileTap={{ scale:0.97 }} onClick={() => setChosen(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${chosen === opt.id ? 'border-[#6666ff] bg-[#6666ff]/10' : 'border-white/5 bg-zinc-800 hover:border-white/20'}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl">{opt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-white">{opt.label}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{opt.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        <button onClick={onClose} disabled={!chosen}
          className="w-full py-3 rounded-xl bg-[#6666ff] text-white font-bold disabled:opacity-40 hover:bg-[#b8baff] hover:text-zinc-900 transition-all">
          Apply &amp; Update Schedule
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Friday Check-in ──────────────────────────────────────────────────────────
function FridayCheckin({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState<number | null>(null);
  const EMOJIS = ['😓','😕','😐','😊','🚀'];
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
        className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <X size={16} className="absolute top-4 right-4 text-zinc-500 cursor-pointer hover:text-white" onClick={onClose} />
        <h3 className="font-bold text-white font-heading text-lg mb-1">Weekly Check-in 📋</h3>
        <p className="text-xs text-zinc-400 mb-5">How tough was this week? AI calibrates next week's intensity.</p>
        <div className="flex justify-between mb-6">
          {EMOJIS.map((e, i) => (
            <motion.button key={i} whileHover={{ scale:1.2 }} whileTap={{ scale:0.9 }} onClick={() => setRating(i+1)}
              className={`text-3xl p-2 rounded-xl transition-all ${rating === i+1 ? 'bg-[#6666ff]/20 ring-2 ring-[#6666ff]' : 'hover:bg-white/5'}`}>
              {e}
            </motion.button>
          ))}
        </div>
        <button onClick={onClose} disabled={!rating}
          className="w-full py-2.5 rounded-xl bg-[#6666ff] text-white font-bold text-sm disabled:opacity-40 hover:bg-[#b8baff] hover:text-zinc-900 transition-all">
          Submit &amp; Calibrate Week 4
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Notification Bell ────────────────────────────────────────────────────────
function NotificationBell({ unread, onClick }: { unread: number; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="relative p-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all touch-manipulation">
      <Bell size={18} className="text-zinc-300" />
      {unread > 0 && (
        <motion.span initial={{ scale:0 }} animate={{ scale:1 }}
          className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] rounded-full bg-[#6666ff] text-white text-[9px] font-bold flex items-center justify-center">
          {unread}
        </motion.span>
      )}
    </button>
  );
}

// ─── Tab Navigation ───────────────────────────────────────────────────────────
type Tab = 'today' | 'calendar' | 'notifications';
const TAB_DATA: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id:'today',         label:'Today',         icon:<ListChecks size={15} /> },
  { id:'calendar',      label:'Calendar',      icon:<CalendarDays size={15} /> },
  { id:'notifications', label:'Notifications', icon:<Bell size={15} /> },
];

// ─── Pacing Header ────────────────────────────────────────────────────────────
function PacingHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 border border-white/5 rounded-xl px-4 py-3 mb-5">
      <div className="flex items-center gap-2">
        <MapPin size={13} className="text-zinc-400 flex-shrink-0" />
        <span className="text-sm text-zinc-300"><strong className="text-white">73 days</strong> to placement season</span>
      </div>
      <span className="text-xs font-bold px-3 py-1 rounded-full border text-[#b9f0d7] bg-[#b9f0d7]/10 border-[#b9f0d7]/30">On track ✓</span>
    </div>
  );
}

// ─── Peer Benchmark Panel ─────────────────────────────────────────────────────
function PeerBenchmark() {
  return (
    <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 mt-4">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-3">Anonymous Batch Snapshot</p>
      <div className="space-y-2.5">
        {[
          { label:'Avg. batch', value:28, color:'bg-zinc-600' },
          { label:'You',        value:34, color:'bg-[#6666ff]' },
          { label:'Top 10%',   value:58, color:'bg-[#b9f0d7]' },
        ].map(r => (
          <div key={r.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">{r.label}</span>
              <span className="font-bold text-white">{r.value}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width:0 }} animate={{ width:`${r.value}%` }} transition={{ duration:0.8 }}
                className={`h-full rounded-full ${r.color}`} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-zinc-500 mt-2">You're in the top 30% 🎉</p>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function RoadmapDashboard() {
  const [tasks,           setTasks]          = useState<Task[]>(SAMPLE_TASKS);
  const [activeTab,       setActiveTab]      = useState<Tab>('today');
  const [showMissedModal, setShowMissedModal] = useState(false);
  const [showReroute,     setShowReroute]    = useState(true);
  const [showCheckin,     setShowCheckin]    = useState(false);
  const [xpFloat,         setXpFloat]        = useState<string | null>(null);
  const [notifOpen,       setNotifOpen]      = useState(false);
  const [notifRead,       setNotifRead]      = useState(false);

  // ── Show missed modal only ONCE per browser session ────────────────────────
  useEffect(() => {
    const already = sessionStorage.getItem(SESSION_KEY);
    if (!already) {
      setShowMissedModal(true);
      sessionStorage.setItem(SESSION_KEY, '1');
    }
  }, []);

  const closeMissedModal = () => setShowMissedModal(false);

  const unreadCount = notifRead ? 0 : NOTIFICATIONS.filter(n => !n.read).length;

  const handleToggle = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    if (task && !task.completed) {
      setXpFloat(id);
      setTimeout(() => setXpFloat(null), 1000);
    }
  };

  const handleTooHard = (id: string) => {
    // In real app: AI splits into sub-tasks
    alert('AI is splitting this into smaller sub-tasks and inserting prerequisites. (Mocked)');
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <PacingHeader />

      {/* AI Reroute Banner */}
      <AnimatePresence>
        {showReroute && (
          <motion.div key="reroute" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="overflow-hidden">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#6666ff]/10 border border-[#6666ff]/30">
              <RefreshCw size={14} className="text-[#b8baff] mt-0.5 flex-shrink-0 animate-spin" style={{ animationDuration:'3s' }} />
              <div className="flex-1 text-sm">
                <p className="font-bold text-[#b8baff]">AI rerouted your plan ✨</p>
                <p className="text-zinc-400 text-xs mt-0.5">Arrays crushed 2 days early! DP moved to Week 3. OS review inserted Friday.</p>
              </div>
              <button onClick={() => setShowReroute(false)} className="text-zinc-500 hover:text-white flex-shrink-0"><X size={14} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">AI Learning Roadmap</h1>
          <p className="text-zinc-400 text-sm mt-0.5">Week 3 of 12 · <span className="text-[#b8baff]">Trees &amp; Recursion</span></p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCheckin(true)}
            className="px-3 py-2 text-xs sm:text-sm font-bold border border-[#f0e5b9]/30 text-[#f0e5b9] rounded-lg hover:bg-[#f0e5b9]/10 transition-all">
            📋 Check-in
          </button>
          <NotificationBell unread={unreadCount} onClick={() => { setNotifOpen(o => !o); setNotifRead(true); }} />
          <Link href="/student/roadmap/timeline"
            className="px-3 py-2 text-xs sm:text-sm font-bold bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-1">
            Timeline <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div key="notif-drop" initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-2xl">
            <NotificationsPanel onMarkAll={() => setNotifRead(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Week strip */}
      <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-3">This Week</p>
        <WeekStrip days={SAMPLE_WEEK_CALENDAR} />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-zinc-900/60 border border-white/5 rounded-xl p-1 w-full sm:w-auto sm:inline-flex">
        {TAB_DATA.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id ? 'bg-[#6666ff] text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}>
            {tab.icon}
            <span className="hidden xs:inline sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {/* ── Today Tab ── */}
        {activeTab === 'today' && (
          <motion.div key="today" initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-white font-heading">Today's Tasks</h2>
                <span className="text-xs text-zinc-400">{completedCount}/{tasks.length} done</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width:`${(completedCount/tasks.length)*100}%` }} className="h-full bg-[#6666ff] rounded-full" transition={{ duration:0.4 }} />
              </div>
              {tasks.map(t => (
                <TaskRow key={t.id} task={t} onToggle={handleToggle} onTooHard={handleTooHard} xpFloat={xpFloat} />
              ))}
              <Link href="/student/roadmap/focus"
                className="flex items-center justify-between w-full p-4 rounded-xl border border-[#6666ff]/20 bg-[#6666ff]/5 hover:bg-[#6666ff]/10 transition-all">
                <div className="flex items-center gap-3">
                  <Star size={16} className="text-[#6666ff]" />
                  <div>
                    <p className="text-sm font-bold text-white">Enter Focus Mode</p>
                    <p className="text-xs text-zinc-400">Pomodoro · ambient sounds · distraction free</p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-[#6666ff]" />
              </Link>
            </div>
            {/* Sidebar */}
            <div>
              <MasterySidebar xp={TOTAL_XP} streak={STREAK} progress={OVERALL_PROGRESS} />
              <PeerBenchmark />
            </div>
          </motion.div>
        )}

        {/* ── Calendar Tab ── */}
        {activeTab === 'calendar' && (
          <motion.div key="calendar" initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
              <CalendarView />
            </div>
            <div>
              <MasterySidebar xp={TOTAL_XP} streak={STREAK} progress={OVERALL_PROGRESS} />
            </div>
          </motion.div>
        )}

        {/* ── Notifications Tab ── */}
        {activeTab === 'notifications' && (
          <motion.div key="notifs" initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
              <NotificationsPanel onMarkAll={() => setNotifRead(true)} />
            </div>
            <div>
              <MasterySidebar xp={TOTAL_XP} streak={STREAK} progress={OVERALL_PROGRESS} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showMissedModal && <MissedDayModal onClose={closeMissedModal} />}
        {showCheckin     && <FridayCheckin  onClose={() => setShowCheckin(false)} />}
      </AnimatePresence>
    </div>
  );
}
