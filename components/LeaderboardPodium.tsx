"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

export default function LeaderboardPodium() {
  const leaderboard = [
    { rank: 2, name: "ByteMaster", score: 2450, height: 120, color: "from-gray-400/20 to-gray-600/10", border: "border-gray-400/30", text: "text-gray-300" },
    { rank: 1, name: "Student (You)", score: 2890, height: 160, color: "from-[#FBBF24]/20 to-[#FBBF24]/5", border: "border-[#FBBF24]/50", text: "text-[#FBBF24]", isUser: true },
    { rank: 3, name: "CodeGod99", score: 2100, height: 90, color: "from-orange-700/20 to-orange-900/10", border: "border-orange-700/30", text: "text-orange-400" },
  ];

  return (
    <div className="h-full flex flex-col justify-end pt-2 gap-6">
      <div className="flex-1 flex items-end justify-center gap-2 sm:gap-4 relative pt-10">
        {leaderboard.map((player) => (
          <div key={player.rank} className="flex flex-col items-center relative w-1/3">
            {/* Player Info Above Bar */}
            <div className="flex flex-col items-center mb-2 z-10 w-full">
              {player.rank === 1 && <Trophy size={20} className="text-[#FBBF24] mb-1 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />}
              {player.rank !== 1 && <Medal size={16} className={`${player.text} mb-1 opacity-70`} />}
              <span className={`text-[10px] sm:text-xs font-bold font-sans text-center truncate w-full ${player.isUser ? 'text-white' : 'text-gray-400'}`}>
                {player.name}
              </span>
              <span className={`text-xs ${player.text} font-bold`}>{player.score}</span>
            </div>

            {/* Podium Bar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: player.height }}
              transition={{ duration: 1.5, type: "spring", bounce: 0.3, delay: player.rank * 0.2 }}
              className={`w-full bg-gradient-to-t ${player.color} border-t-2 ${player.border} rounded-t-xl relative overflow-hidden`}
            >
              {player.isUser && (
                <div className="absolute inset-0 bg-white/5 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
              )}
              <div className="absolute bottom-4 left-0 w-full text-center opacity-30 text-5xl font-black font-heading">
                {player.rank}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-[#b9f0d7]/20 flex items-center justify-center text-[#b9f0d7] font-bold text-xs border border-[#b9f0d7]/30">#1</div>
           <div>
             <div className="text-xs text-gray-400 font-sans">Your Position</div>
             <div className="text-sm font-bold text-white flex items-center gap-1">Top 1% <ChevronUp size={14} className="text-[#b9f0d7]" /></div>
           </div>
        </div>
        <button 
          onClick={() => toast.success("Loading global leaderboard...")}
          className="px-3 py-1.5 bg-[#c9e8ff]/10 text-[#c9e8ff] hover:bg-[#c9e8ff]/20 text-xs font-bold rounded-lg transition-colors cursor-pointer hover:scale-105"
        >
          View Ladder
        </button>
      </div>
    </div>
  );
}
