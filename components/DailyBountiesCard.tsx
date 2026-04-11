"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyCheck, Coins, Sparkles, Plus, Star } from "lucide-react";
import toast from "react-hot-toast";

interface Bounty {
  id: string;
  title: string;
  reward: number;
}

const initialBounties: Bounty[] = [
  { id: "b1", title: "Complete Advanced React Patterns", reward: 50 },
  { id: "b2", title: "Solve 2 Medium Graphs Problems", reward: 100 },
  { id: "b3", title: "Connect GitHub Profile", reward: 20 },
  { id: "b4", title: "Review 1 Peer Code Submission", reward: 30 },
  { id: "b5", title: "Pass AI Mock System Design", reward: 150 },
];

export default function DailyBountiesCard() {
  const [bounties, setBounties] = useState<Bounty[]>(initialBounties);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [floatingCoins, setFloatingCoins] = useState<{id: number, x: number}[]>([]);

  const claimBounty = (id: string, e: React.MouseEvent) => {
    if (claimed.includes(id)) return;
    
    // Add to claimed
    setClaimed(prev => [...prev, id]);

    // Animate coin
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setFloatingCoins(prev => [...prev, { id: Date.now(), x: rect.left }]);
    
    setTimeout(() => {
      setFloatingCoins(prev => prev.slice(1));
    }, 1000);
  };

  const requestCustomBounty = () => {
    const customTitle = window.prompt("Enter your custom bounty request:");
    if (customTitle && customTitle.trim() !== "") {
      const newBounty: Bounty = {
        id: "b" + Date.now(),
        title: customTitle.trim(),
        reward: Math.floor(Math.random() * 50) + 20, // Random reward between 20-70
      };
      setBounties(prev => [...prev, newBounty]);
      toast.success(`Custom bounty added successfully!`);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h3 className="text-sm font-bold text-white flex items-center gap-2">
             Daily Bounties <Star className="text-orange-400 fill-orange-400" size={14} />
           </h3>
           <p className="text-xs text-gray-400 font-sans">Complete tasks to earn Unthink Coins</p>
        </div>
      </div>

      <div className="space-y-3 relative">
        <AnimatePresence>
          {floatingCoins.map((coin) => (
             <motion.div
               key={coin.id}
               initial={{ opacity: 1, y: 0, scale: 0.5 }}
               animate={{ opacity: 0, y: -50, scale: 1.5 }}
               transition={{ duration: 1 }}
               className="absolute z-50 text-[#FBBF24] flex items-center"
               style={{ left: "50%", top: 0 }}
             >
               <Coins size={24} className="fill-[#FBBF24]" />
               <span className="font-bold ml-1">+XP</span>
             </motion.div>
          ))}
        </AnimatePresence>

        {bounties.map((bounty) => {
          const isClaimed = claimed.includes(bounty.id);
          return (
            <motion.div 
              key={bounty.id}
              layout
              className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${isClaimed ? 'bg-white/5 border-white/5 opacity-50 grayscale' : 'bg-gradient-to-r from-[#0c0c16] to-[#6666ff]/10 border-[#6666ff]/20'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isClaimed ? 'bg-gray-800 text-gray-500' : 'bg-[#FBBF24]/20 text-[#FBBF24]'}`}>
                  {isClaimed ? <CopyCheck size={16} /> : <Coins size={16} />}
                </div>
                <div>
                  <h4 className={`text-sm font-bold font-sans ${isClaimed ? 'text-gray-400 line-through' : 'text-white'}`}>{bounty.title}</h4>
                  <p className="text-xs text-[#FBBF24] font-bold">Reward: {bounty.reward} Coins</p>
                </div>
              </div>

              <button 
                onClick={(e) => claimBounty(bounty.id, e)}
                disabled={isClaimed}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isClaimed ? 'bg-transparent text-gray-500' : 'bg-[#6666ff] text-white hover:bg-[#6666ff]/80 hover:scale-105 shadow-[0_0_10px_rgba(102,102,255,0.4)]'}`}
              >
                {isClaimed ? 'Claimed' : 'Claim'}
              </button>
            </motion.div>
          );
        })}
      </div>
      
      <button 
        onClick={requestCustomBounty}
        className="w-full mt-4 py-2 border border-dashed border-white/20 text-gray-400 rounded-lg text-xs font-bold hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
      >
        <Plus size={14} /> Request Specific Bounty
      </button>
    </div>
  );
}
