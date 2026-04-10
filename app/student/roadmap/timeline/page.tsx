'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Lock, Circle, CheckCircle2, Clock, ChevronRight,
  Zap, X, AlertCircle,
} from 'lucide-react';
import { SAMPLE_ROADMAP, RoadmapTopic, TRACK_META } from '@/lib/roadmap-data';

// ─── Status visuals ───────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  completed:    { bg: 'bg-[#b9f0d7]/10',   border: 'border-[#b9f0d7]/30', text: 'text-[#b9f0d7]',  badge: 'bg-[#b9f0d7]/20 text-[#b9f0d7]' },
  'in-progress':{ bg: 'bg-[#6666ff]/10',   border: 'border-[#6666ff]/40', text: 'text-[#6666ff]',  badge: 'bg-[#6666ff]/20 text-[#6666ff]' },
  upcoming:     { bg: 'bg-zinc-900/50',     border: 'border-white/5',      text: 'text-zinc-300',   badge: 'bg-zinc-700 text-zinc-300' },
  locked:       { bg: 'bg-zinc-900/20',     border: 'border-white/5',      text: 'text-zinc-600',   badge: 'bg-zinc-800 text-zinc-500' },
  'needs-review':{ bg: 'bg-[#f0e5b9]/10',  border: 'border-[#f0e5b9]/30', text: 'text-[#f0e5b9]',  badge: 'bg-[#f0e5b9]/20 text-[#f0e5b9]' },
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  completed:    <CheckCircle2 size={16} />,
  'in-progress':<Circle size={16} className="text-[#6666ff]" />,
  upcoming:     <Circle size={16} />,
  locked:       <Lock size={16} />,
  'needs-review':<AlertCircle size={16} />,
};

// ─── Topic Card ───────────────────────────────────────────────────────────────
function TopicCard({ topic, onClick }: { topic: RoadmapTopic; onClick: () => void }) {
  const s = STATUS_STYLES[topic.status];
  const meta = TRACK_META[topic.track] ?? { icon: '📌', color: '#6666ff' };
  const locked = topic.status === 'locked';

  return (
    <motion.button
      whileHover={!locked ? { scale: 1.02, x: 4 } : {}}
      whileTap={!locked ? { scale: 0.98 } : {}}
      onClick={!locked ? onClick : undefined}
      className={`w-full text-left p-4 rounded-xl border transition-all ${s.bg} ${s.border} ${locked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-lg'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">{meta.icon}</span>
          <div>
            <p className={`font-bold text-sm ${s.text}`}>{topic.title}</p>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${s.badge}`}>
                {topic.status.replace('-', ' ')}
              </span>
              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                <Clock size={10} /> {topic.estimatedHours}h
              </span>
              <span className="text-[10px] text-[#6666ff] flex items-center gap-1">
                <Zap size={10} /> {topic.xp} XP
              </span>
            </div>
          </div>
        </div>
        <div className={`flex-shrink-0 mt-0.5 ${s.text}`}>
          {STATUS_ICONS[topic.status]}
        </div>
      </div>
    </motion.button>
  );
}

// ─── Topic Drawer ─────────────────────────────────────────────────────────────
function TopicDrawer({ topic, onClose }: { topic: RoadmapTopic; onClose: () => void }) {
  const diffColor = { Easy: 'text-[#b9f0d7]', Medium: 'text-[#f0e5b9]', Hard: 'text-red-400' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative w-full max-w-md bg-zinc-950 border-l border-white/10 h-full overflow-y-auto p-6 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{topic.track}</p>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">{topic.title}</h2>

        <div className="flex gap-2 mb-6">
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${STATUS_STYLES[topic.status].badge}`}>
            {topic.status.replace('-', ' ')}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 flex items-center gap-1">
            <Clock size={10} /> {topic.estimatedHours}h
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-[#6666ff]/20 text-[#6666ff] flex items-center gap-1">
            <Zap size={10} /> {topic.xp} XP
          </span>
        </div>

        {/* Subtopics */}
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Subtopics</h3>
          <ul className="space-y-2">
            {topic.subtopics.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6666ff] flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Problems */}
        {topic.problems.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Recommended Problems</h3>
            <div className="space-y-2">
              {topic.problems.map((p) => (
                <div key={p.title} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">{p.title}</p>
                    <p className="text-xs text-zinc-500">{p.platform}</p>
                  </div>
                  <span className={`text-xs font-bold ${diffColor[p.difficulty as keyof typeof diffColor]}`}>
                    {p.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {topic.prerequisiteIds.length > 0 && (
          <div className="mb-6 p-3 rounded-lg bg-[#f0e5b9]/5 border border-[#f0e5b9]/20">
            <p className="text-xs text-[#f0e5b9] font-bold mb-1">⚠ Prerequisites required</p>
            <p className="text-xs text-zinc-400">Complete {topic.prerequisiteIds.length} topic(s) before unlocking this.</p>
          </div>
        )}

        <button className="w-full py-3 rounded-xl bg-[#6666ff] text-white font-bold hover:bg-[#b8baff] hover:text-zinc-900 transition-all">
          {topic.status === 'in-progress' ? 'Continue Topic' : 'Start Topic'} →
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Week timeline group ──────────────────────────────────────────────────────
function WeekGroup({ week, onTopicClick, activeWeek }: any) {
  const allDone = week.topics.every((t: RoadmapTopic) => t.status === 'completed');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {/* Week marker */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${allDone ? 'bg-[#b9f0d7]/20 border-[#b9f0d7]/40 text-[#b9f0d7]' : 'bg-zinc-800 border-white/10 text-zinc-300'}`}>
          {week.weekNumber}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Week {week.weekNumber}</p>
          <h3 className="font-heading font-bold text-white">{week.theme}</h3>
        </div>
      </div>

      {/* Topic cards with connector line */}
      <div className="ml-5 pl-8 border-l border-white/5 space-y-3 pb-8">
        {week.topics.map((topic: RoadmapTopic) => (
          <TopicCard key={topic.id} topic={topic} onClick={() => onTopicClick(topic)} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Full Timeline page ───────────────────────────────────────────────────────
export default function RoadmapTimeline() {
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);

  const completedTopics = SAMPLE_ROADMAP.flatMap((w) => w.topics).filter((t) => t.status === 'completed').length;
  const totalTopics = SAMPLE_ROADMAP.flatMap((w) => w.topics).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/student/roadmap" className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">12-Week Roadmap</h1>
          <p className="text-zinc-400 text-sm mt-0.5 font-sans">{completedTopics} of {totalTopics} topics completed</p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5 mb-8">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-zinc-400">Overall Progress</span>
          <span className="font-bold text-white">{Math.round((completedTopics / totalTopics) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedTopics / totalTopics) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#6666ff] to-[#b9f0d7] rounded-full"
          />
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { label: 'Completed', color: 'bg-[#b9f0d7]' },
            { label: 'In Progress', color: 'bg-[#6666ff]' },
            { label: 'Upcoming', color: 'bg-zinc-700' },
            { label: 'Locked', color: 'bg-zinc-800' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-xs text-zinc-400">
              <div className={`w-2.5 h-2.5 rounded-sm ${s.color}`} />
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Week groups */}
      <div className="space-y-0">
        {SAMPLE_ROADMAP.map((week) => (
          <WeekGroup
            key={week.weekNumber}
            week={week}
            onTopicClick={setSelectedTopic}
          />
        ))}
        {/* Remaining weeks placeholder */}
        {[4].map((w) => (
          <div key={`ph${w}`} className="flex items-center gap-4 mb-8 opacity-30">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border border-white/10 bg-zinc-900 text-zinc-600">
              5–12
            </div>
            <p className="text-zinc-600 font-sans text-sm">Weeks 5–12 unlock as you progress…</p>
          </div>
        ))}
      </div>

      {/* Topic drawer */}
      <AnimatePresence>
        {selectedTopic && (
          <TopicDrawer topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
