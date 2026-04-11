"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, PhoneOff, Cpu, Loader2, Sparkles, Activity } from "lucide-react";

export default function AIMockInterviewCard() {
  const [sessionState, setSessionState] = useState<"idle" | "connecting" | "live">("idle");
  
  // Random heights for voice equalizer
  const [bars, setBars] = useState([10, 20, 15, 30, 10]);

  useEffect(() => {
    if (sessionState === "live") {
      const interval = setInterval(() => {
        setBars([
          Math.random() * 40 + 10,
          Math.random() * 60 + 20,
          Math.random() * 80 + 20,
          Math.random() * 60 + 20,
          Math.random() * 40 + 10,
        ]);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [sessionState]);

  const startInterview = () => {
    setSessionState("connecting");
    setTimeout(() => {
      setSessionState("live");
    }, 2500);
  };

  const endInterview = () => {
    setSessionState("idle");
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
           <h3 className="text-sm text-gray-400 font-sans mb-1">AI Mock Interview</h3>
           <p className="text-lg font-bold text-white flex items-center gap-2">
             Google L5 Recruiter <Sparkles className="text-yellow-400" size={16} />
           </p>
        </div>
        <div className="p-2 bg-[#6666ff]/10 rounded-full text-[#6666ff]">
          <Cpu size={20} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center py-6 min-h-[140px] relative">
        <AnimatePresence mode="wait">
          {sessionState === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#0c0c16] rounded-full border border-white/10 flex items-center justify-center mx-auto mb-3 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#6666ff]/20 to-[#b9f0d7]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Mic className="text-gray-400 group-hover:text-white transition-colors" size={24} />
              </div>
              <p className="text-xs text-gray-500 max-w-[200px]">Voice & systemic reasoning assessment powered by Gemini Pro</p>
            </motion.div>
          )}

          {sessionState === "connecting" && (
            <motion.div 
              key="connecting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center flex flex-col items-center"
            >
              <Loader2 className="animate-spin text-[#6666ff] mb-3" size={32} />
              <p className="text-sm font-bold text-white mb-1">Establishing Secure Link...</p>
              <p className="text-xs text-gray-400">Calibrating Microphone</p>
            </motion.div>
          )}

          {sessionState === "live" && (
            <motion.div 
              key="live"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full text-center relative"
            >
              <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 px-2 py-0.5 bg-red-500/20 border border-red-500/50 rounded text-[10px] text-red-400 font-bold flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                LIVE
              </div>
              <div className="flex items-end justify-center gap-1.5 h-16 mb-4">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: h }}
                    className="w-3 bg-gradient-to-t from-[#6666ff] to-[#b8baff] rounded-full opacity-80"
                    transition={{ type: "spring", bounce: 0, duration: 0.2 }}
                  />
                ))}
              </div>
              <p className="text-xs text-[#b8baff] font-bold">"Hello, Student. Let's begin the system design round."</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4">
        {sessionState === "idle" ? (
          <button 
            onClick={startInterview}
            className="w-full py-2.5 bg-gradient-to-r from-[#6666ff] to-[#b8baff] text-[#0c0c16] rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(102,102,255,0.3)] hover:shadow-[0_0_30px_rgba(102,102,255,0.5)] hover:scale-[1.02] transition-all"
          >
            Start 1-on-1 Session
          </button>
        ) : sessionState === "live" ? (
           <button 
            onClick={endInterview}
            className="w-full py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <PhoneOff size={16} /> End Interview
          </button>
        ) : (
          <div className="w-full py-2.5 bg-white/5 text-gray-500 rounded-xl text-sm font-bold text-center cursor-not-allowed">
            Connecting...
          </div>
        )}
      </div>
    </div>
  );
}
