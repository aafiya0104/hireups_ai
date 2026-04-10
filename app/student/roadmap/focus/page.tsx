'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Play, Pause, RotateCcw, CheckCircle2, Zap, Coffee,
} from 'lucide-react';
import { SAMPLE_TASKS } from '@/lib/roadmap-data';

const WORK_SECONDS = 25 * 60;  // 25 min
const BREAK_SECONDS = 5 * 60;  // 5 min

type Phase = 'idle' | 'work' | 'break' | 'summary';

function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

// ─── Circular timer ───────────────────────────────────────────────────────────
function CircularTimer({ seconds, total, phase }: { seconds: number; total: number; phase: Phase }) {
  const size = 200;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = ((total - seconds) / total) * circ;
  const color = phase === 'break' ? '#b9f0d7' : '#6666ff';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg] absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          style={{
            strokeDasharray: circ,
            strokeDashoffset: circ - dash,
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>
      <div className="relative z-10 text-center">
        <p className="text-5xl font-bold font-heading text-white">{formatTime(seconds)}</p>
        <p className="text-xs uppercase tracking-widest mt-1" style={{ color }}>
          {phase === 'idle' ? 'Ready' : phase === 'work' ? 'Focus' : phase === 'break' ? 'Break' : 'Done!'}
        </p>
      </div>
    </div>
  );
}

// ─── Session summary card ─────────────────────────────────────────────────────
function SummaryCard({ completedCount, theoryCovered, onReset }: {
  completedCount: number; theoryCovered: number; onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-900 border border-[#b9f0d7]/30 rounded-2xl p-6 text-center max-w-sm mx-auto"
    >
      <div className="text-4xl mb-4">🎯</div>
      <h3 className="text-xl font-heading font-bold text-white mb-2">Session Complete!</h3>
      <p className="text-zinc-400 text-sm mb-6 font-sans">
        You solved <strong className="text-[#b9f0d7]">{completedCount} problem{completedCount !== 1 ? 's' : ''}</strong> and
        covered <strong className="text-[#b8baff]">{theoryCovered} theory topic{theoryCovered !== 1 ? 's' : ''}</strong> today.
      </p>
      <div className="flex gap-3 mb-5">
        <div className="flex-1 bg-zinc-800 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-[#6666ff]">+{completedCount * 60 + theoryCovered * 40}</p>
          <p className="text-[10px] text-zinc-400">XP Earned</p>
        </div>
        <div className="flex-1 bg-zinc-800 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-[#b9f0d7]">25 min</p>
          <p className="text-[10px] text-zinc-400">Deep Focus</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onReset} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all text-sm font-bold">
          Another Session
        </button>
        <Link href="/student/roadmap" className="flex-1 py-2.5 rounded-xl bg-[#6666ff] text-white hover:bg-[#b8baff] hover:text-zinc-900 transition-all text-sm font-bold text-center">
          Back to Dashboard
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Focus Mode Page ──────────────────────────────────────────────────────────
export default function FocusMode() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [seconds, setSeconds] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = phase === 'break' ? BREAK_SECONDS : WORK_SECONDS;

  const tick = useCallback(() => {
    setSeconds((prev) => {
      if (prev <= 1) {
        setRunning(false);
        if (phase === 'work') {
          setPhase('break');
          setSeconds(BREAK_SECONDS);
        } else {
          setPhase('summary');
        }
        return 0;
      }
      return prev - 1;
    });
  }, [phase]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(tick, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, tick]);

  const handleStart = () => {
    if (phase === 'idle') setPhase('work');
    if (phase === 'break') {
      setSession((s) => s + 1);
    }
    setRunning(true);
  };

  const handlePause = () => setRunning(false);

  const handleReset = () => {
    setRunning(false);
    setPhase('idle');
    setSeconds(WORK_SECONDS);
    setSession(1);
    setCompletedTasks([]);
  };

  const handleStartBreak = () => {
    setPhase('break');
    setSeconds(BREAK_SECONDS);
    setRunning(true);
  };

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const problemsDone = completedTasks.filter((id) =>
    SAMPLE_TASKS.find((t) => t.id === id && t.topic === 'DSA'),
  ).length;

  const theoryDone = completedTasks.filter((id) =>
    SAMPLE_TASKS.find((t) => t.id === id && t.topic !== 'DSA'),
  ).length;

  return (
    <div className="min-h-screen bg-[#060610] flex flex-col items-center justify-center px-4 py-8">
      {/* Back + header */}
      <div className="absolute top-6 left-6">
        <Link href="/student/roadmap" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} /> Exit focus mode
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {phase !== 'summary' ? (
          <motion.div
            key="timer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-8 w-full max-w-xl"
          >
            {/* Session indicator */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`w-2 h-2 rounded-full ${s <= session ? 'bg-[#6666ff]' : 'bg-zinc-700'}`} />
              ))}
              <span className="text-xs text-zinc-500 ml-2">Session {session} of 4</span>
            </div>

            {/* Phase badge */}
            <AnimatePresence mode="wait">
              {phase === 'break' ? (
                <motion.div
                  key="break"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#b9f0d7]/10 border border-[#b9f0d7]/30 rounded-full text-[#b9f0d7] text-sm font-bold"
                >
                  <Coffee size={14} /> Take a 5-minute break ☕
                </motion.div>
              ) : (
                <motion.div
                  key="work"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6666ff]/10 border border-[#6666ff]/30 rounded-full text-[#b8baff] text-sm font-bold"
                >
                  <Zap size={14} /> Deep focus — distraction free ⚡
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timer */}
            <CircularTimer seconds={seconds} total={total} phase={phase} />

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="p-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <RotateCcw size={18} />
              </button>

              {running ? (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-zinc-800 border border-white/10 text-white font-bold hover:bg-zinc-700 transition-all"
                >
                  <Pause size={18} /> Pause
                </button>
              ) : phase === 'work' && seconds < WORK_SECONDS ? (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#6666ff] text-white font-bold hover:bg-[#b8baff] hover:text-zinc-900 transition-all"
                >
                  <Play size={18} /> Resume
                </button>
              ) : phase === 'break' && !running ? (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#b9f0d7] text-zinc-900 font-bold hover:opacity-90 transition-all"
                >
                  <Coffee size={18} /> Start Break
                </button>
              ) : (
                <button
                  onClick={phase === 'work' ? handleStart : () => { setPhase('work'); setSeconds(WORK_SECONDS); setRunning(true); }}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#6666ff] text-white font-bold hover:bg-[#b8baff] hover:text-zinc-900 transition-all shadow-[0_0_20px_rgba(102,102,255,0.3)]"
                >
                  <Play size={18} /> {phase === 'idle' ? 'Start Focus Session' : 'Next Session'}
                </button>
              )}

              {phase === 'work' && running && (
                <button
                  onClick={() => setPhase('summary')}
                  className="p-3 rounded-xl border border-white/10 text-zinc-400 hover:text-[#b9f0d7] hover:border-[#b9f0d7]/30 transition-all text-xs"
                  title="End session early"
                >
                  End
                </button>
              )}
            </div>

            {/* Task checklist */}
            {phase === 'work' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-5"
              >
                <p className="text-xs uppercase tracking-wider text-zinc-500 mb-4">Today's tasks to cover</p>
                <div className="space-y-3">
                  {SAMPLE_TASKS.map((t) => (
                    <label key={t.id} className="flex items-center gap-3 cursor-pointer group">
                      <button onClick={() => toggleTask(t.id)} className="flex-shrink-0">
                        {completedTasks.includes(t.id) ? (
                          <CheckCircle2 size={18} className="text-[#b9f0d7]" />
                        ) : (
                          <div className="w-[18px] h-[18px] rounded-full border-2 border-zinc-600 group-hover:border-[#6666ff] transition-colors" />
                        )}
                      </button>
                      <p className={`text-sm ${completedTasks.includes(t.id) ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>
                        {t.title}
                      </p>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <SummaryCard
              completedCount={problemsDone}
              theoryCovered={theoryDone}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
