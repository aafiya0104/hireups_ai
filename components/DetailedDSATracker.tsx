"use client";

import React, { useMemo } from "react";
import { Lock, Target, Zap, Code, Flame } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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
}

const dummyProblems: Problem[] = [
  { id: "p1", topicId: "Arrays", difficulty: "Easy", solved: true },
  { id: "p2", topicId: "Arrays", difficulty: "Easy", solved: true },
  { id: "p3", topicId: "Arrays", difficulty: "Medium", solved: true },
  { id: "p4", topicId: "Arrays", difficulty: "Hard", solved: true },
  { id: "p5", topicId: "TwoPointers", difficulty: "Easy", solved: true },
  { id: "p6", topicId: "TwoPointers", difficulty: "Medium", solved: false },
  { id: "p7", topicId: "FastSlowPointers", difficulty: "Easy", solved: false },
  { id: "p8", topicId: "SlidingWindow", difficulty: "Medium", solved: false },
  { id: "p9", topicId: "Trees", difficulty: "Medium", solved: true },
  { id: "p10", topicId: "Trees", difficulty: "Hard", solved: false },
];

const topics: Topic[] = [
  { id: "Arrays", name: "Arrays & Hashing", prereqs: [] },
  { id: "TwoPointers", name: "Two Pointers", prereqs: ["Arrays"] },
  { id: "FastSlowPointers", name: "Fast & Slow Pointers", prereqs: ["TwoPointers"] },
  { id: "SlidingWindow", name: "Sliding Window", prereqs: ["TwoPointers"] },
  { id: "Trees", name: "Trees & Graphs", prereqs: [] },
  { id: "DP", name: "Dynamic Programming", prereqs: ["Trees"] }, // just for graph complexity
];

const getDifficultyPoints = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "Hard": return 3;
    case "Medium": return 2;
    case "Easy": return 1;
    default: return 0;
  }
};

export default function DetailedDSATracker() {
  // Compute stats
  const topicStats = useMemo(() => {
    return topics.map((topic) => {
      const topicProblems = dummyProblems.filter((p) => p.topicId === topic.id);
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

  const totalSolved = dummyProblems.filter(p => p.solved).length;
  
  const weakZones = useMemo(() => {
    return topicStats
      .filter(t => topicStatuses[t.id] === "Available" && t.masteryScore > 0 && t.masteryScore < 60)
      .map(t => t.name)
      .slice(0, 2);
  }, [topicStats, topicStatuses]);

  const nextBestTopic = useMemo(() => {
    const available = topicStats.filter(t => topicStatuses[t.id] === "Available");
    if (available.length === 0) return "All done!";
    available.sort((a, b) => a.masteryScore - b.masteryScore);
    return available[0].name;
  }, [topicStats, topicStatuses]);

  return (
    <motion.div
      layoutId="dsa-tracker-card"
      className="bg-[#0c0c16]/50 border border-white/5 rounded-2xl p-6 backdrop-blur h-full flex flex-col relative overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 z-10 relative">
        <div className="p-3 rounded-lg bg-[#b9f0d7]/10 text-[#b9f0d7]">
          <Code size={24} />
        </div>
        <h2 className="text-xl font-heading font-bold text-white">DSA Mastery</h2>
      </div>

      <div className="space-y-4 z-10 relative flex-1">
        <div className="flex items-center gap-2 mb-2 p-3 bg-black/40 rounded-xl border border-white/5">
           <div className="p-2 bg-gradient-to-tr from-[#6666ff]/20 to-[#b9f0d7]/20 rounded-lg">
              <Flame size={20} className="text-orange-400" />
           </div>
           <div className="flex-1">
              <div className="flex justify-between text-xs font-bold text-white mb-1">
                <span>DSA Level 42</span>
                <span className="text-[#b9f0d7]">850/1000 XP</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                 <motion.div initial={{width:0}} animate={{width:"85%"}} className="h-full bg-gradient-to-r from-[#6666ff] to-[#b9f0d7]" />
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/40 p-4 rounded-xl border border-[#b9f0d7]/20 text-center">
            <div className="text-2xl font-bold text-[#b9f0d7]">{totalSolved}</div>
            <div className="text-xs text-gray-400">Problems Solved</div>
          </div>
          <div className="bg-black/40 p-4 rounded-xl border border-[#6666ff]/20 text-center flex flex-col justify-center items-center">
             <div className="flex items-center gap-1 text-[#6666ff]">
                <Target size={16} />
                <span className="text-sm font-bold truncate max-w-full">Next Gen</span>
             </div>
             <div className="text-xs text-gray-400 mt-1 max-w-[90px] truncate" title={nextBestTopic}>{nextBestTopic}</div>
          </div>
        </div>
        
        <div className="pt-2">
          <h4 className="text-sm font-bold text-gray-300 font-sans mb-2">Weak Zones Flagged by AI</h4>
          <div className="flex flex-wrap gap-2">
            {weakZones.length > 0 ? weakZones.map(zone => (
              <span key={zone} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">
                {zone}
              </span>
            )) : (
              <span className="text-xs text-gray-500 italic">No weak zones detected yet</span>
            )}
          </div>
        </div>
      </div>
      
      <Link 
        href="/student/dsa-mastery"
        className="w-full py-2 border border-[#b9f0d7]/30 bg-[#b9f0d7]/10 text-[#b9f0d7] font-bold rounded-lg text-sm hover:bg-[#b9f0d7]/20 transition-colors z-10 mt-4 flex justify-center items-center gap-2 group"
      >
        <Zap size={16} className="group-hover:animate-pulse" /> Launch Gamified Hub
      </Link>

      {/* Abstract background nodes for visual effect */}
      <div className="absolute right-[-20%] bottom-[-20%] w-48 h-48 bg-[#6666ff]/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute left-[-10%] top-[40%] w-32 h-32 bg-[#b9f0d7]/10 blur-2xl rounded-full pointer-events-none" />
    </motion.div>
  );
}
