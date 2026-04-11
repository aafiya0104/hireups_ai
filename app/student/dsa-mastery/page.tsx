"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Zap, Code, CheckCircle2, Trophy, ChevronLeft, Database, Network, GitBranch, ArrowRightLeft, FastForward, Maximize, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import SkillRadarChart from "../../../components/SkillRadarChart";
import DailyBountiesCard from "../../../components/DailyBountiesCard";
import LeaderboardPodium from "../../../components/LeaderboardPodium";
import AIMockInterviewCard from "../../../components/AIMockInterviewCard";
import CodingIDEModal from "../../../components/CodingIDEModal";

const topicIcons: Record<string, any> = {
  "Arrays": Database,
  "TwoPointers": ArrowRightLeft,
  "FastSlowPointers": FastForward,
  "SlidingWindow": Maximize,
  "Trees": GitBranch,
  "DP": Network,
};

type Difficulty = "Hard" | "Medium" | "Easy";

interface Problem {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  solved: boolean;
}

interface Topic {
  id: string;
  name: string;
  prereqs: string[];
  level: number;
}

const initialDummyProblems: Problem[] = [
  { id: "p1", topicId: "Arrays", difficulty: "Easy", solved: true },
  { id: "p2", topicId: "Arrays", difficulty: "Medium", solved: true },
  
  { id: "p3", topicId: "TwoPointers", difficulty: "Medium", solved: false },
  { id: "p4", topicId: "TwoPointers", difficulty: "Hard", solved: false },
  
  { id: "p5", topicId: "SlidingWindow", difficulty: "Easy", solved: false },
  { id: "p6", topicId: "SlidingWindow", difficulty: "Medium", solved: false },
  
  { id: "p7", topicId: "DP", difficulty: "Hard", solved: false },
  { id: "p8", topicId: "DP", difficulty: "Medium", solved: false },
  
  { id: "p9", topicId: "FastSlowPointers", difficulty: "Hard", solved: false },
  
  { id: "p10", topicId: "Trees", difficulty: "Hard", solved: false },
  { id: "p11", topicId: "Trees", difficulty: "Medium", solved: false },
];

const topics: Topic[] = [
  { id: "Arrays", name: "Arrays & Hashing", prereqs: [], level: 1 },
  { id: "TwoPointers", name: "Two Pointers", prereqs: ["Arrays"], level: 2 },
  { id: "SlidingWindow", name: "Sliding Window", prereqs: ["Arrays"], level: 2 },
  { id: "DP", name: "Dynamic Programming", prereqs: ["TwoPointers"], level: 3 },
  { id: "FastSlowPointers", name: "Fast & Slow", prereqs: ["SlidingWindow"], level: 3 },
  { id: "Trees", name: "Trees & Graphs", prereqs: ["DP", "FastSlowPointers"], level: 4 },
];

const getDifficultyPoints = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "Hard": return 3;
    case "Medium": return 2;
    case "Easy": return 1;
    default: return 0;
  }
};

export default function DSAMasteryPage() {
  const [problems, setProblems] = useState<Problem[]>(initialDummyProblems);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);

  const activeProblem = activeProblemId ? problems.find(p => p.id === activeProblemId) ?? null : null;
  const activeTopicName = activeTopicId ? (topics.find(t => t.id === activeTopicId)?.name ?? "") : "";

  const topicStats = useMemo(() => {
    return topics.map((topic) => {
      const topicProblems = problems.filter((p) => p.topicId === topic.id);
      const totalPoints = topicProblems.reduce((sum, p) => sum + getDifficultyPoints(p.difficulty), 0);
      const solvedPoints = topicProblems
        .filter((p) => p.solved)
        .reduce((sum, p) => sum + getDifficultyPoints(p.difficulty), 0);
      const masteryScore = totalPoints === 0 ? 0 : Math.round((solvedPoints / totalPoints) * 100);
      return { ...topic, masteryScore };
    });
  }, []);

  const getTopicStatus = (topicId: string, stats: typeof topicStats) => {
    const topic = stats.find((t) => t.id === topicId);
    if (!topic) return "Locked";
    const prereqsMet = topic.prereqs.every((prereqId) => {
      const pStat = stats.find((t) => t.id === prereqId);
      return pStat && pStat.masteryScore === 100;
    });
    if (!prereqsMet) return "Locked";
    if (topic.masteryScore === 100) return "Completed";
    return "Available";
  };

  const topicStatuses = useMemo(() => {
    const map: Record<string, "Locked" | "Completed" | "Available"> = {};
    topicStats.forEach((t) => { map[t.id] = getTopicStatus(t.id, topicStats); });
    return map;
  }, [topicStats]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-[#b9f0d7] border-[#b9f0d7]/30 bg-[#b9f0d7]/10 shadow-[0_0_15px_rgba(185,240,215,0.2)]";
      case "Available": return "text-[#6666ff] border-[#6666ff]/30 bg-[#6666ff]/10 shadow-[0_0_15px_rgba(102,102,255,0.2)]";
      default: return "text-gray-500 border-gray-800 bg-gray-900/50 grayscale opacity-60";
    }
  };

  const renderNode = (topic: any) => {
    const status = topicStatuses[topic.id];
    const isLocked = status === "Locked";
    const statusClasses = getStatusColor(status);
    const IconComponent = topicIcons[topic.id] || Database;
    
    return (
      <motion.button 
        whileHover={!isLocked ? { scale: 1.05 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
        className={`w-64 p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 text-left relative overflow-hidden group ${statusClasses}`}
        onClick={() => {
          if (!isLocked) {
             setActiveTopicId(topic.id);
             toast.success(`⚔️ Entering Arena: ${topic.name}...`);
          } else {
             toast.error(`🔒 Level Locked! Master previous tiers to access.`);
          }
        }}
      >
        {/* Shimmer Hover effect for available nodes */}
        {status === "Available" && (
           <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
        )}

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${status === "Completed" ? "bg-[#b9f0d7]/20 text-[#b9f0d7]" : status === "Available" ? "bg-[#6666ff]/20 text-[#6666ff]" : "bg-gray-800 text-gray-500"}`}>
               <IconComponent size={16} />
             </div>
             <div className="font-heading font-bold text-sm leading-tight text-white">{topic.name}</div>
          </div>
          {status === "Completed" && <CheckCircle2 className="text-[#b9f0d7] shrink-0" size={18} />}
          {status === "Available" && <Zap className="text-[#6666ff] animate-pulse shrink-0 drop-shadow-[0_0_8px_rgba(102,102,255,0.8)]" size={18} />}
          {isLocked && <Lock className="text-gray-500 shrink-0" size={18} />}
        </div>
        
        <div className="space-y-2 relative z-10">
          <div className="flex justify-between text-xs font-sans">
            <span className={status === "Completed" ? "text-[#b9f0d7]" : "text-gray-400"}>Mastery Score</span>
            <span className="font-bold">{topic.masteryScore}%</span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden shadow-inner">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${topic.masteryScore}%` }}
               transition={{ duration: 1, delay: 0.2 }}
               className={`h-full rounded-full ${status === "Completed" ? "bg-[#b9f0d7] shadow-[0_0_10px_#b9f0d7]" : status === "Available" ? "bg-[#6666ff] shadow-[0_0_10px_#6666ff]" : "bg-gray-600"}`} 
            />
          </div>
        </div>

        {isLocked && (
          <div className="mt-4 pt-3 border-t border-gray-700/50 text-xs text-gray-400 relative z-10 font-sans">
            Requires: {topic.prereqs.map((p:string) => topics.find(t=>t.id===p)?.name).join(", ")}
          </div>
        )}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-[#0c0c16] flex flex-col items-center pt-8 overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#6666ff]/20 blur-[150px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[#b9f0d7]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="w-full max-w-[1600px] px-6 pb-6 flex justify-between items-center z-10 border-b border-white/5 mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/student" className="p-2 border border-white/10 hover:bg-white/10 rounded-lg transition-colors text-white mr-2 flex justify-center items-center">
            <ChevronLeft size={20} />
          </Link>
          <div className="p-2 rounded-lg bg-[#b9f0d7]/10 text-[#b9f0d7]">
            <Code size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">Advanced DSA Hub</h2>
            <p className="text-sm text-gray-400">Your gamified battleground for coding interviews.</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1600px] flex-1 relative flex flex-col lg:flex-row gap-6 p-6 h-[calc(100vh-100px)] z-10 mx-auto">
        
        {/* Left Gamification Sidebar */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6 overflow-y-auto pr-2 pb-10 custom-scrollbar relative z-10">
          <div className="bg-black/50 p-5 rounded-2xl border border-white/10 backdrop-blur shadow-2xl">
            <SkillRadarChart />
          </div>
          <div className="bg-black/50 p-5 rounded-2xl border border-white/10 backdrop-blur shadow-2xl min-h-[300px]">
            <DailyBountiesCard />
          </div>
          <div className="bg-black/50 p-5 rounded-2xl border border-white/10 backdrop-blur shadow-2xl min-h-[250px]">
            <AIMockInterviewCard />
          </div>
        </div>

        {/* Center: Interactive Node-Link Graph */}
        <div className="flex-1 relative bg-black/40 rounded-3xl border border-white/5 overflow-auto p-10 flex flex-col items-center shadow-inner custom-scrollbar relative z-10">
           <div className="w-full flex justify-between items-center mb-10 pb-4 border-b border-white/5 relative z-20">
              <h3 className="text-lg font-bold text-white font-heading">AI Prerequisite Roadmap</h3>
              <div className="px-3 py-1 bg-[#6666ff]/20 text-[#6666ff] text-xs font-bold rounded-lg border border-[#6666ff]/30 flex items-center gap-2">
                <Zap size={14} className="animate-pulse" /> Live Analysis Mode
              </div>
           </div>

           <div className="relative max-w-5xl w-full flex-1 flex flex-col justify-center">
             <div className="flex flex-col gap-16 sm:gap-24 items-center">
                
                {[1, 2, 3, 4, 5].map(level => {
                  const levelTopics = topicStats.filter(t => t.level === level);
                  if (levelTopics.length === 0) return null;
                  return (
                    <div key={`level-${level}`} className="flex flex-wrap justify-center gap-8 relative z-10 w-full">
                      {levelTopics.map(topic => (
                         <div key={topic.id} className="relative group flex justify-center">
                            {renderNode(topic)}
                         </div>
                      ))}
                    </div>
                  );
                })}

             </div>

             {/* Backdrop connection lines simulation */}
             <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen h-full top-32">
                <svg width="100%" height="100%" className="absolute inset-0">
                   <path d="M 50% 20% C 50% 35%, 35% 35%, 35% 50%" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeDasharray="8,8" className="animate-[dash_30s_linear_infinite]" />
                   <path d="M 50% 20% C 50% 35%, 65% 35%, 65% 50%" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeDasharray="8,8" className="animate-[dash_30s_linear_infinite]" />
                   <path d="M 35% 60% C 35% 85%, 50% 85%, 50% 90%" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeDasharray="8,8" className="animate-[dash_30s_linear_infinite]" />
                   <defs>
                     <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                       <stop offset="0%" stopColor="#6666ff" />
                       <stop offset="100%" stopColor="#b9f0d7" />
                     </linearGradient>
                   </defs>
                </svg>
             </div>
          </div>
        </div>

        {/* Right Gamification Sidebar */}
        <div className="w-full lg:w-[350px] bg-black/50 p-5 rounded-2xl border border-white/10 backdrop-blur shadow-2xl flex flex-col z-10 overflow-hidden relative">
          <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2 text-white border-b border-white/10 pb-4">
            <Trophy size={18} className="text-[#FBBF24]" /> Arena Ranking
          </h3>
          <div className="flex-1 mt-4">
            <LeaderboardPodium />
          </div>
          <div className="mt-8 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/10 rounded-xl border border-orange-500/30">
            <p className="text-xs text-orange-200 font-bold mb-1 uppercase tracking-wider">Rank Decay Warning</p>
            <p className="text-xs text-orange-100/70">Solve 2 more questions this week to defend your Top 1% rank from ByteMaster!</p>
          </div>
        </div>

      </div>

      {/* Gamified Topic Modal */}
      <AnimatePresence>
        {activeTopicId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-[#0c0c16] border border-white/10 rounded-3xl p-8 relative shadow-[0_0_50px_rgba(102,102,255,0.2)]"
            >
              <button 
                onClick={() => setActiveTopicId(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
                 <Zap className="text-[#6666ff]" />
                 {topics.find(t => t.id === activeTopicId)?.name} Arena
              </h2>
              <p className="text-gray-400 font-sans mb-8">Solve the core problems below to master this module and unlock new branches in your roadmap.</p>
              
              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {problems.filter(p => p.topicId === activeTopicId).map((prob, idx) => (
                  <motion.div
                    key={prob.id}
                    whileHover={!prob.solved ? { scale: 1.01, x: 4 } : {}}
                    onClick={() => { if (!prob.solved) { setActiveProblemId(prob.id); } }}
                    className={`p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between transition-colors ${
                      prob.solved ? "opacity-60 cursor-default" : "hover:bg-white/10 hover:border-[#6666ff]/30 cursor-pointer"
                    }`}
                  >
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${prob.solved ? 'bg-[#b9f0d7]/20 text-[#b9f0d7]' : 'bg-white/10 text-gray-400'}`}>
                           {prob.solved ? <CheckCircle2 size={16} /> : idx + 1}
                        </div>
                        <div>
                          <span className={`font-sans font-bold block ${prob.solved ? 'text-gray-500 line-through' : 'text-white'}`}>Algorithm Challenge {prob.id.replace('p', '')}</span>
                          {!prob.solved && <span className="text-[10px] text-[#6666ff] font-sans">Click to solve in IDE →</span>}
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className={`text-xs font-bold px-2 py-1 rounded-md ${prob.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : prob.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                         {prob.difficulty}
                       </span>
                       {!prob.solved && <Code size={14} className="text-[#6666ff] opacity-60" />}
                     </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
                 <button 
                   onClick={() => setActiveTopicId(null)}
                   className="px-6 py-3 rounded-xl font-bold font-sans text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                 >
                   Retreat
                 </button>
                 <button 
                   onClick={() => {
                      setProblems(prev => prev.map(p => p.topicId === activeTopicId ? { ...p, solved: true } : p));
                      toast.success(`🎉 Module Mastered! New Tiers Unlocked!`);
                      setActiveTopicId(null);
                   }}
                   className="px-6 py-3 rounded-xl font-bold font-sans bg-gradient-to-r from-[#6666ff] to-[#b9f0d7] text-black hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[0_0_20px_rgba(102,102,255,0.4)]"
                 >
                   <Trophy size={18} /> Complete All Problems
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IDE Modal — opens over the topic modal */}
      {activeProblemId && activeProblem && (
        <CodingIDEModal
          problem={activeProblem}
          topicName={activeTopicName}
          onClose={() => setActiveProblemId(null)}
          onSolve={(problemId) => {
            setProblems(prev => prev.map(p => p.id === problemId ? { ...p, solved: true } : p));
            setActiveProblemId(null);
          }}
        />
      )}
    </div>
  );
}
