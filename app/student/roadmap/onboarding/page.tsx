'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, ChevronLeft, Check, Clock, Calendar, Zap, BookOpen,
} from 'lucide-react';
import {
  Branch, Track, BRANCH_TRACKS, TRACK_META,
} from '@/lib/roadmap-data';

// ─── Branch icons / labels ────────────────────────────────────────────────────
const BRANCHES: { id: Branch; label: string; icon: string; desc: string }[] = [
  { id: 'CS', label: 'Computer Science', icon: '💻', desc: 'DSA · OS · DBMS · System Design' },
  { id: 'IT', label: 'Information Technology', icon: '🌐', desc: 'DSA · CN · DBMS · Web dev tracks' },
  { id: 'ECE', label: 'Electronics & Comm.', icon: '📡', desc: 'DSA · Digital Elec. · OS · CN' },
  { id: 'Mech', label: 'Mechanical', icon: '⚙️', desc: 'DSA · Aptitude · OOP · Thermodynamics' },
  { id: 'Civil', label: 'Civil Engineering', icon: '🏗', desc: 'DSA · Aptitude · OOP · Structural' },
];

const TIME_SLOTS = [
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '3 hours+', value: 180 },
];

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <motion.div
            animate={{
              backgroundColor: s < step ? '#6666ff' : s === step ? '#b8baff' : '#1e1e2e',
              scale: s === step ? 1.15 : 1,
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border border-white/10"
          >
            {s < step ? <Check size={14} /> : s}
          </motion.div>
          {s < 3 && (
            <div className="w-16 h-[2px] rounded-full overflow-hidden bg-white/10">
              <motion.div
                animate={{ width: s < step ? '100%' : '0%' }}
                className="h-full bg-[#6666ff]"
                transition={{ duration: 0.4 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Live coverage estimate ────────────────────────────────────────────────────
function CoverageEstimate({
  tracks, daysLeft, minutesPerDay,
}: { tracks: Track[]; daysLeft: number; minutesPerDay: number }) {
  const totalMinutesAvailable = daysLeft * minutesPerDay;
  const totalMinutesNeeded = tracks.length * 600; // ~10 hrs/track rough est
  const pct = Math.min(100, Math.round((totalMinutesAvailable / totalMinutesNeeded) * 100));

  return (
    <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
      <p className="text-sm text-zinc-400 mb-2 font-sans">Estimated coverage before placement</p>
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full rounded-full ${pct >= 70 ? 'bg-[#b9f0d7]' : pct >= 40 ? 'bg-[#f0e5b9]' : 'bg-red-400'}`}
        />
      </div>
      <p className={`text-xs mt-2 font-bold ${pct >= 70 ? 'text-[#b9f0d7]' : pct >= 40 ? 'text-[#f0e5b9]' : 'text-red-400'}`}>
        {pct}% of selected tracks — {pct >= 70 ? 'Great pacing! 🎉' : pct >= 40 ? 'Decent, push harder 💪' : 'Add more daily time ⚠️'}
      </p>
    </div>
  );
}

// ─── Main Onboarding ─────────────────────────────────────────────────────────
export default function RoadmapOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [branch, setBranch] = useState<Branch>('CS');
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [daysLeft, setDaysLeft] = useState(90);
  const [minutesPerDay, setMinutesPerDay] = useState(60);

  // Pre-select recommended tracks when branch changes
  useEffect(() => {
    setSelectedTracks(BRANCH_TRACKS[branch]);
  }, [branch]);

  const toggleTrack = (t: Track) => {
    setSelectedTracks((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const handleFinish = () => {
    // In a real app: save to context / DB
    router.push('/student/roadmap');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[36rem] h-[36rem] bg-[#6666ff] rounded-full blur-[160px] opacity-[0.06]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6666ff]/10 text-[#b8baff] text-xs font-bold border border-[#6666ff]/20 mb-4">
            <Zap size={12} /> AI Roadmap Setup
          </span>
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            Let's build your roadmap
          </h1>
          <p className="text-zinc-400 font-sans text-sm">
            Takes 60 seconds — AI generates your personalised day-by-day plan.
          </p>
        </motion.div>

        <ProgressBar step={step} />

        {/* Steps */}
        <AnimatePresence mode="wait">
          {/* ── Step 1: Branch ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-heading font-bold text-white mb-2">
                What's your branch?
              </h2>
              <p className="text-sm text-zinc-400 mb-6 font-sans">
                Auto-detected based on your profile. Confirm or change below.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BRANCHES.map((b) => (
                  <motion.button
                    key={b.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setBranch(b.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      branch === b.id
                        ? 'border-[#6666ff] bg-[#6666ff]/10 shadow-[0_0_20px_rgba(102,102,255,0.15)]'
                        : 'border-white/5 bg-zinc-900/50 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{b.icon}</span>
                      <div>
                        <p className="font-bold text-white text-sm">{b.label}</p>
                        <p className="text-xs text-zinc-400">{b.desc}</p>
                      </div>
                      {branch === b.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-5 h-5 rounded-full bg-[#6666ff] flex items-center justify-center"
                        >
                          <Check size={12} className="text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Tracks ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-heading font-bold text-white mb-2">
                Choose your target tracks
              </h2>
              <p className="text-sm text-zinc-400 mb-6 font-sans">
                Recommended for <strong className="text-white">{branch}</strong> are pre-selected.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BRANCH_TRACKS[branch].map((t) => {
                  const meta = TRACK_META[t];
                  const active = selectedTracks.includes(t);
                  return (
                    <motion.button
                      key={t}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTrack(t)}
                      className={`relative p-4 rounded-xl border text-left transition-all ${
                        active
                          ? 'border-white/20 bg-zinc-800'
                          : 'border-white/5 bg-zinc-900/40 opacity-60'
                      }`}
                      style={active ? { boxShadow: `0 0 14px ${meta.color}22` } : {}}
                    >
                      {active && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: meta.color }}
                        >
                          <Check size={10} className="text-black" />
                        </motion.div>
                      )}
                      <span className="text-2xl mb-2 block">{meta.icon}</span>
                      <p className="font-bold text-white text-sm">{t}</p>
                      <p className="text-[10px] text-zinc-400 mt-1">{meta.desc}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Date + time ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-heading font-bold text-white mb-2">
                Set your timeline
              </h2>

              {/* Days to placement */}
              <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar size={16} className="text-[#b8baff]" />
                    Days to placement season
                  </span>
                  <span className="text-[#6666ff] font-bold text-xl font-heading">{daysLeft}</span>
                </div>
                <input
                  type="range"
                  min={30} max={180} step={5}
                  value={daysLeft}
                  onChange={(e) => setDaysLeft(Number(e.target.value))}
                  className="w-full accent-[#6666ff]"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  <span>30 days</span><span>180 days</span>
                </div>
              </div>

              {/* Daily time */}
              <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-5">
                <p className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-[#b9f0d7]" />
                  Daily time commitment
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setMinutesPerDay(t.value)}
                      className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                        minutesPerDay === t.value
                          ? 'bg-[#6666ff] text-white border-[#6666ff]'
                          : 'bg-zinc-800 text-zinc-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live preview */}
              <CoverageEstimate
                tracks={selectedTracks}
                daysLeft={daysLeft}
                minutesPerDay={minutesPerDay}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 transition-all font-sans text-sm"
            >
              <ChevronLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6666ff] text-white font-bold hover:bg-[#b8baff] hover:text-zinc-900 transition-all shadow-md"
            >
              Continue <ChevronRight size={16} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#b9f0d7] text-zinc-900 font-bold hover:opacity-90 transition-all shadow-md"
            >
              <BookOpen size={16} /> Generate My Roadmap
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
