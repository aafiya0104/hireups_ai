'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle2, Zap, Coffee, Volume2, VolumeX } from 'lucide-react';
import { SAMPLE_TASKS } from '@/lib/roadmap-data';

const WORK_SECS  = 25 * 60;
const BREAK_SECS =  5 * 60;
type Phase = 'idle' | 'work' | 'break' | 'summary';

function fmt(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2,'0')}:${(s % 60).toString().padStart(2,'0')}`;
}

// ─── Ambient Sound Types ──────────────────────────────────────────────────────
type AmbientType = 'none' | 'rain' | 'ocean' | 'forest' | 'brownNoise' | 'whiteNoise' | 'cafe';

const AMBIENT_OPTIONS: { id: AmbientType; label: string; emoji: string; desc: string }[] = [
  { id:'none',       emoji:'🔇', label:'Silent',      desc:'Pure focus' },
  { id:'rain',       emoji:'🌧',  label:'Rain',        desc:'Gentle drops' },
  { id:'ocean',      emoji:'🌊', label:'Ocean Waves',  desc:'Rolling surf' },
  { id:'forest',     emoji:'🌲', label:'Forest',       desc:'Birdsong wind' },
  { id:'brownNoise', emoji:'🎙', label:'Brown Noise',  desc:'Deep rumble' },
  { id:'whiteNoise', emoji:'📻', label:'White Noise',  desc:'Crisp hiss' },
  { id:'cafe',       emoji:'☕', label:'Café',          desc:'Soft chatter' },
];

// ─── Web Audio Ambient Engine ─────────────────────────────────────────────────
class AmbientEngine {
  ctx: AudioContext | null = null;
  master: GainNode | null  = null;
  sources: AudioScheduledSourceNode[] = [];
  oscNodes: OscillatorNode[]          = [];

  private getCtx() {
    if (!this.ctx) {
      this.ctx    = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  private makeNoiseBuf(ctx: AudioContext, secs = 2): AudioBuffer {
    const buf  = ctx.createBuffer(1, ctx.sampleRate * secs, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  private makeBrownBuf(ctx: AudioContext, secs = 2): AudioBuffer {
    const buf  = ctx.createBuffer(1, ctx.sampleRate * secs, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    return buf;
  }

  private noise(ctx: AudioContext, freq: number, q = 0.5, buf?: AudioBuffer): { src: AudioBufferSourceNode; filter: BiquadFilterNode } {
    const src    = ctx.createBufferSource();
    src.buffer   = buf ?? this.makeNoiseBuf(ctx);
    src.loop     = true;
    const filter = ctx.createBiquadFilter();
    filter.type  = 'lowpass';
    filter.frequency.setValueAtTime(freq, ctx.currentTime);
    filter.Q.setValueAtTime(q, ctx.currentTime);
    src.connect(filter);
    filter.connect(this.master!);
    src.start();
    this.sources.push(src);
    return { src, filter };
  }

  play(type: AmbientType, volume: number) {
    this.stop();
    if (type === 'none') return;
    const ctx = this.getCtx();
    this.master!.gain.setValueAtTime(volume, ctx.currentTime);

    switch (type) {
      case 'rain': {
        // Primary rain layer — bandpass filtered white noise
        const { filter } = this.noise(ctx, 500);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.Q.setValueAtTime(0.3, ctx.currentTime);
        // Secondary lighter layer for texture
        const buf2  = this.makeNoiseBuf(ctx);
        const src2  = ctx.createBufferSource();
        src2.buffer = buf2; src2.loop = true;
        const f2    = ctx.createBiquadFilter();
        f2.type     = 'bandpass';
        f2.frequency.setValueAtTime(1200, ctx.currentTime);
        const g2    = ctx.createGain();
        g2.gain.setValueAtTime(0.4, ctx.currentTime);
        src2.connect(f2); f2.connect(g2); g2.connect(this.master!);
        src2.start();
        this.sources.push(src2);
        break;
      }
      case 'ocean': {
        // Band-pass noise with slow LFO for wave feel
        const buf    = this.makeNoiseBuf(ctx, 4);
        const src    = ctx.createBufferSource();
        src.buffer   = buf; src.loop = true;
        const bpf    = ctx.createBiquadFilter();
        bpf.type     = 'bandpass';
        bpf.frequency.setValueAtTime(600, ctx.currentTime);
        bpf.Q.setValueAtTime(0.5, ctx.currentTime);
        const lfo    = ctx.createOscillator();
        lfo.type     = 'sine';
        lfo.frequency.setValueAtTime(0.15, ctx.currentTime); // slow wave
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(400, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(bpf.frequency);
        src.connect(bpf); bpf.connect(this.master!);
        src.start(); lfo.start();
        this.sources.push(src); this.oscNodes.push(lfo);
        break;
      }
      case 'forest': {
        // Very light noise + high-freq chirp oscillators
        const buf3  = this.makeNoiseBuf(ctx);
        const src3  = ctx.createBufferSource();
        src3.buffer = buf3; src3.loop = true;
        const f3    = ctx.createBiquadFilter();
        f3.type     = 'highpass';
        f3.frequency.setValueAtTime(800, ctx.currentTime);
        f3.Q.setValueAtTime(0.2, ctx.currentTime);
        const g3    = ctx.createGain();
        g3.gain.setValueAtTime(0.3, ctx.currentTime);
        src3.connect(f3); f3.connect(g3); g3.connect(this.master!);
        src3.start();
        this.sources.push(src3);
        // Occasional random high notes for birds
        const schedChirp = () => {
          const o = ctx.createOscillator();
          o.type  = 'sine';
          o.frequency.setValueAtTime(2400 + Math.random() * 800, ctx.currentTime);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, ctx.currentTime);
          g.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
          o.connect(g); g.connect(this.master!);
          o.start(); o.stop(ctx.currentTime + 0.35);
          this.oscNodes.push(o);
        };
        const id = setInterval(schedChirp, 1200 + Math.random() * 2000);
        (this as any)._forestInterval = id;
        break;
      }
      case 'brownNoise':
        this.noise(ctx, 800, 0.3, this.makeBrownBuf(ctx));
        break;
      case 'whiteNoise':
        this.noise(ctx, 4000, 0.1);
        break;
      case 'cafe': {
        // Low murmur: multiple detuned oscillators + noise
        for (let i = 0; i < 6; i++) {
          const o   = ctx.createOscillator();
          o.type    = 'sawtooth';
          o.frequency.setValueAtTime(80 + Math.random() * 160, ctx.currentTime);
          const g   = ctx.createGain();
          g.gain.setValueAtTime(0.015, ctx.currentTime);
          o.connect(g); g.connect(this.master!);
          o.start();
          this.oscNodes.push(o);
        }
        this.noise(ctx, 600, 0.2);
        break;
      }
    }
  }

  setVolume(v: number) {
    if (this.master && this.ctx) this.master.gain.setValueAtTime(v, this.ctx.currentTime);
  }

  stop() {
    this.sources.forEach(s => { try { s.stop(); } catch {} });
    this.oscNodes.forEach(o => { try { o.stop(); } catch {} });
    this.sources = []; this.oscNodes = [];
    if ((this as any)._forestInterval) clearInterval((this as any)._forestInterval);
  }

  destroy() { this.stop(); this.ctx?.close(); }
}

// ─── Ambient Player Component ─────────────────────────────────────────────────
function AmbientPlayer() {
  const [active, setActive]   = useState<AmbientType>('none');
  const [volume, setVolume]   = useState(0.4);
  const [muted,  setMuted]    = useState(false);
  const engineRef             = useRef<AmbientEngine | null>(null);

  useEffect(() => {
    engineRef.current = new AmbientEngine();
    return () => engineRef.current?.destroy();
  }, []);

  const handleSelect = (type: AmbientType) => {
    setActive(type);
    engineRef.current?.play(type, muted ? 0 : volume);
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    if (!muted) engineRef.current?.setVolume(v);
  };

  const handleMute = () => {
    const next = !muted;
    setMuted(next);
    engineRef.current?.setVolume(next ? 0 : volume);
  };

  return (
    <div className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Ambient Sounds</p>
        <div className="flex items-center gap-2">
          <button onClick={handleMute} className="text-zinc-500 hover:text-white transition-colors">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input type="range" min={0} max={1} step={0.02} value={volume}
            onChange={e => handleVolume(Number(e.target.value))}
            className="w-20 accent-[#6666ff]" />
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {AMBIENT_OPTIONS.map(opt => (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleSelect(opt.id)}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
              active === opt.id
                ? 'border-[#6666ff]/60 bg-[#6666ff]/15 shadow-[0_0_12px_rgba(102,102,255,0.2)]'
                : 'border-white/5 bg-zinc-800/60 hover:border-white/20'
            }`}
          >
            <motion.span
              animate={active === opt.id ? { scale:[1,1.2,1] } : { scale:1 }}
              transition={{ repeat: active === opt.id ? Infinity : 0, duration: 2.5 }}
              className="text-xl leading-none select-none"
            >{opt.emoji}</motion.span>
            <span className="text-[9px] font-bold text-zinc-300 text-center leading-tight">{opt.label}</span>
          </motion.button>
        ))}
      </div>

      {active !== 'none' && (
        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} className="overflow-hidden">
          <div className="flex items-center gap-2 pt-1">
            <motion.div animate={{ scale:[1,1.05,1] }} transition={{ repeat:Infinity, duration:2 }}
              className="w-2 h-2 rounded-full bg-[#b9f0d7]" />
            <span className="text-xs text-zinc-400">
              Playing: <strong className="text-[#b9f0d7]">{AMBIENT_OPTIONS.find(o => o.id === active)?.label}</strong> — {AMBIENT_OPTIONS.find(o => o.id === active)?.desc}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Circular Timer ───────────────────────────────────────────────────────────
function CircularTimer({ seconds, total, phase }: { seconds: number; total: number; phase: Phase }) {
  const SIZE = 200, STROKE = 10;
  const r    = (SIZE - STROKE) / 2;
  const circ = 2 * Math.PI * r;
  const fill = ((total - seconds) / total) * circ;
  const col  = phase === 'break' ? '#b9f0d7' : '#6666ff';

  return (
    <div className="relative flex items-center justify-center" style={{ width:SIZE, height:SIZE }}>
      <svg width={SIZE} height={SIZE} className="rotate-[-90deg] absolute inset-0">
        <circle cx={SIZE/2} cy={SIZE/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={STROKE} />
        <motion.circle
          cx={SIZE/2} cy={SIZE/2} r={r} fill="none" stroke={col} strokeWidth={STROKE} strokeLinecap="round"
          style={{
            strokeDasharray: circ,
            strokeDashoffset: circ - fill,
            filter: `drop-shadow(0 0 10px ${col})`,
          }}
        />
      </svg>
      <div className="relative z-10 text-center">
        <p className="text-5xl font-bold font-heading text-white tabular-nums">{fmt(seconds)}</p>
        <p className="text-xs uppercase tracking-widest mt-1 font-medium" style={{ color: col }}>
          {{ idle:'Ready', work:'Focus', break:'Break', summary:'Done' }[phase]}
        </p>
      </div>
    </div>
  );
}

// ─── Session Summary ──────────────────────────────────────────────────────────
function SummaryCard({ problemsDone, theoryDone, onReset }: {
  problemsDone: number; theoryDone: number; onReset: () => void;
}) {
  return (
    <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
      className="bg-zinc-900 border border-[#b9f0d7]/30 rounded-2xl p-6 text-center max-w-sm mx-auto">
      <div className="text-5xl mb-4">🎯</div>
      <h3 className="text-xl font-heading font-bold text-white mb-2">Session Complete!</h3>
      <p className="text-zinc-400 text-sm mb-5 font-sans leading-relaxed">
        You solved <strong className="text-[#b9f0d7]">{problemsDone} problem{problemsDone !== 1 ? 's' : ''}</strong> and covered{' '}
        <strong className="text-[#b8baff]">{theoryDone} theory topic{theoryDone !== 1 ? 's' : ''}</strong> today. 🔥
      </p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-zinc-800 rounded-xl p-3">
          <p className="text-xl font-bold text-[#6666ff]">+{problemsDone * 60 + theoryDone * 40}</p>
          <p className="text-[10px] text-zinc-400">XP Earned</p>
        </div>
        <div className="bg-zinc-800 rounded-xl p-3">
          <p className="text-xl font-bold text-[#b9f0d7]">25 min</p>
          <p className="text-[10px] text-zinc-400">Deep Focus</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onReset} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all text-sm font-bold">Again</button>
        <Link href="/student/roadmap" className="flex-1 py-2.5 rounded-xl bg-[#6666ff] text-white hover:bg-[#b8baff] hover:text-zinc-900 transition-all text-sm font-bold text-center">Dashboard</Link>
      </div>
    </motion.div>
  );
}

// ─── Focus Page ───────────────────────────────────────────────────────────────
export default function FocusMode() {
  const [phase,          setPhase]          = useState<Phase>('idle');
  const [seconds,        setSeconds]        = useState(WORK_SECS);
  const [running,        setRunning]        = useState(false);
  const [session,        setSession]        = useState(1);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = phase === 'break' ? BREAK_SECS : WORK_SECS;

  const tick = useCallback(() => {
    setSeconds(prev => {
      if (prev <= 1) {
        setRunning(false);
        setPhase(p => { if (p === 'work') { setSeconds(BREAK_SECS); return 'break'; } setPhase('summary'); return 'summary'; });
        return 0;
      }
      return prev - 1;
    });
  }, []);

  useEffect(() => {
    if (running) { timerRef.current = setInterval(tick, 1000); }
    else { if (timerRef.current) clearInterval(timerRef.current); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, tick]);

  const start = () => { if (phase === 'idle') setPhase('work'); setRunning(true); };
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setPhase('idle'); setSeconds(WORK_SECS); setSession(1); setCompletedTasks([]); };

  const nextSession = () => { setSession(s => s + 1); setPhase('work'); setSeconds(WORK_SECS); setRunning(true); };

  const toggleTask = (id: string) =>
    setCompletedTasks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const problemsDone = completedTasks.filter(id => SAMPLE_TASKS.find(t => t.id === id && t.topic === 'DSA')).length;
  const theoryDone   = completedTasks.filter(id => SAMPLE_TASKS.find(t => t.id === id && t.topic !== 'DSA')).length;

  return (
    <div className="min-h-screen bg-[#060610] flex flex-col px-4">
      {/* Back */}
      <div className="pt-5 pb-2">
        <Link href="/student/roadmap" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm">
          <ArrowLeft size={15} /> Exit focus mode
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {phase !== 'summary' ? (
          <motion.div key="timer" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
            className="flex flex-col items-center gap-6 py-6 w-full max-w-lg mx-auto flex-1">

            {/* Session pips */}
            <div className="flex items-center gap-1.5">
              {[1,2,3,4].map(s => (
                <div key={s} className={`w-2 h-2 rounded-full transition-all ${s <= session ? 'bg-[#6666ff] scale-110' : 'bg-zinc-700'}`} />
              ))}
              <span className="text-xs text-zinc-500 ml-2">Session {session} of 4</span>
            </div>

            {/* Phase pill */}
            <AnimatePresence mode="wait">
              {phase === 'break' ? (
                <motion.div key="break" initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#b9f0d7]/10 border border-[#b9f0d7]/30 rounded-full text-[#b9f0d7] text-sm font-bold">
                  <Coffee size={14} /> 5-minute break ☕
                </motion.div>
              ) : (
                <motion.div key="work" initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6666ff]/10 border border-[#6666ff]/30 rounded-full text-[#b8baff] text-sm font-bold">
                  <Zap size={14} className="animate-pulse" /> Deep focus ⚡
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timer */}
            <CircularTimer seconds={seconds} total={total} phase={phase} />

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button onClick={reset} className="p-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                <RotateCcw size={18} />
              </button>
              {running ? (
                <button onClick={pause} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-zinc-800 border border-white/10 text-white font-bold hover:bg-zinc-700 transition-all">
                  <Pause size={18} /> Pause
                </button>
              ) : phase === 'break' ? (
                <button onClick={start} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#b9f0d7] text-zinc-900 font-bold hover:opacity-90 transition-all">
                  <Coffee size={18} /> Start Break
                </button>
              ) : phase === 'idle' ? (
                <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} onClick={start}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#6666ff] text-white font-bold shadow-[0_0_20px_rgba(102,102,255,0.35)] hover:bg-[#b8baff] hover:text-zinc-900 transition-all">
                  <Play size={18} /> Start Session
                </motion.button>
              ) : (
                <button onClick={start} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#6666ff] text-white font-bold hover:bg-[#b8baff] hover:text-zinc-900 transition-all">
                  <Play size={18} /> Resume
                </button>
              )}
              {phase === 'break' && !running && (
                <button onClick={nextSession} className="p-3 rounded-xl border border-white/10 text-zinc-400 hover:text-[#b9f0d7] hover:border-[#b9f0d7]/30 transition-all text-xs font-bold">
                  Skip
                </button>
              )}
            </div>

            {/* Task checklist (work phase only) */}
            {(phase === 'work' || phase === 'idle') && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Today's tasks to cover</p>
                {SAMPLE_TASKS.map(t => (
                  <label key={t.id} className="flex items-center gap-3 cursor-pointer group py-1" onClick={() => toggleTask(t.id)}>
                    <div className="flex-shrink-0">
                      {completedTasks.includes(t.id)
                        ? <motion.div initial={{ scale:0 }} animate={{ scale:1 }}><CheckCircle2 size={18} className="text-[#b9f0d7]" /></motion.div>
                        : <div className="w-[18px] h-[18px] rounded-full border-2 border-zinc-600 group-hover:border-[#6666ff] transition-colors" />}
                    </div>
                    <p className={`text-sm ${completedTasks.includes(t.id) ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>{t.title}</p>
                  </label>
                ))}
              </motion.div>
            )}

            {/* Ambient sounds — always visible */}
            <AmbientPlayer />
          </motion.div>
        ) : (
          <motion.div key="summary" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
            className="flex-1 flex items-center justify-center py-12">
            <SummaryCard problemsDone={problemsDone} theoryDone={theoryDone} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
