"use client";

import { motion } from "framer-motion";
import { Filter, Users, MessageSquare, Calendar, Building, ChevronRight, Check } from "lucide-react";

export default function RecruiterDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-100px)]">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center bg-[#0c0c16] pb-6 border-b border-white/5 shrink-0"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#b8baff]/20 rounded-xl flex items-center justify-center border border-[#b8baff]/30">
            <Building className="text-[#b8baff]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">TechNova Hiring Hub</h1>
            <p className="text-sm text-gray-400 font-sans">Active Drives: SDE-1, Data Analyst</p>
          </div>
        </div>
        <div>
          <button className="px-4 py-2 bg-[#b8baff] text-[#0c0c16] font-bold rounded-lg hover:bg-[#c9e8ff] transition-colors">Post New JD</button>
        </div>
      </motion.div>

      {/* Main Layout */}
      <div className="flex flex-1 gap-6 pt-6 min-h-0">
        
        {/* Sidebar: AI Curated Shortlists */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-1/3 bg-[#0c0c16]/50 border border-white/5 rounded-2xl p-4 backdrop-blur flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-heading font-bold flex items-center gap-2">
               <Users size={18} className="text-[#b9f0d7]" /> AI Shortlists
            </h2>
            <button className="text-gray-400 hover:text-white"><Filter size={16} /></button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {[
              { name: "Rahul S.", role: "SDE-1", match: "98%", status: "Interviewing", color: "text-green-400" },
              { name: "Ananya M.", role: "SDE-1", match: "95%", status: "Screening", color: "text-[#b9f0d7]" },
              { name: "Karan V.", role: "SDE-1", match: "91%", status: "Offer Sent", color: "text-[#6666ff]" },
              { name: "Neha D.", role: "Data Analyst", match: "89%", status: "New", color: "text-white" },
            ].map((cand, i) => (
              <div key={i} className={`p-3 rounded-xl border ${i===0 ? 'border-[#b9f0d7]/40 bg-[#b9f0d7]/5' : 'border-white/5 bg-black/40'} cursor-pointer hover:border-[#b9f0d7]/40 transition-colors`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm tracking-wide">{cand.name}</h4>
                  <span className={`text-xs font-bold ${cand.color}`}>{cand.match} Match</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                   <span className="text-xs text-gray-400">{cand.role}</span>
                   <span className="text-[10px] uppercase bg-white/5 px-2 py-0.5 rounded text-gray-300">{cand.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Detail View: Candidate Profile & Engagement */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 bg-[#0c0c16]/50 border border-white/5 rounded-2xl flex flex-col backdrop-blur overflow-hidden"
        >
          {/* Profile Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-start bg-gradient-to-r from-black/20 to-transparent">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <h2 className="text-2xl font-bold font-heading">Rahul S.</h2>
                 <span className="bg-[#b9f0d7]/20 text-[#b9f0d7] px-2 py-0.5 text-xs rounded border border-[#b9f0d7]/30 font-bold flex items-center gap-1">
                   <Check size={12}/> 98% Match
                 </span>
              </div>
              <p className="text-sm text-gray-400">B.Tech CS • 9.2 CGPA • Advanced DSA Mastery</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"><MessageSquare size={18} /></button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#6666ff] text-white text-sm font-bold rounded-lg hover:bg-[#b8baff] hover:text-[#0c0c16] transition-colors"><Calendar size={16} /> Schedule</button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            <div>
              <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">AI Skill Breakdown</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                   <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">DSA & Problem Solving</span><span className="text-white font-bold">95/100</span></div>
                   <div className="w-full bg-white/5 h-1.5 rounded-full"><div className="bg-[#b9f0d7] h-1.5 rounded-full w-[95%]"></div></div>
                </div>
                <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                   <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">Frontend (React)</span><span className="text-white font-bold">88/100</span></div>
                   <div className="w-full bg-white/5 h-1.5 rounded-full"><div className="bg-[#b8baff] h-1.5 rounded-full w-[88%]"></div></div>
                </div>
                <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                   <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">Backend System Design</span><span className="text-white font-bold">82/100</span></div>
                   <div className="w-full bg-white/5 h-1.5 rounded-full"><div className="bg-[#6666ff] h-1.5 rounded-full w-[82%]"></div></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">ATS Portfolio Summary</h3>
              <div className="bg-black/40 p-4 border border-white/5 rounded-xl space-y-3">
                <p className="text-sm text-gray-400 leading-relaxed font-sans">
                  Built a distributed cache architecture for a microservices project resulting in 40% reduction in query latency. 
                  Active contributor to LeetCode with 300+ solved problems (Top 15% globally). Successfully implemented real-time web sockets for a campus event platform.
                </p>
                <button className="text-xs text-[#b8baff] font-bold hover:underline flex items-center gap-1">View Full AI Portfolio <ChevronRight size={14}/></button>
              </div>
            </div>

            {/* Engagement tracker */}
            <div>
              <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Hiring Pipeline</h3>
              <div className="flex items-center justify-between text-sm font-sans mt-4 max-w-lg">
                <div className="flex flex-col items-center gap-2 text-[#b9f0d7]">
                  <div className="w-6 h-6 rounded-full bg-[#b9f0d7]/20 flex items-center justify-center border border-[#b9f0d7]"><Check size={12}/></div>
                  <span>Applied</span>
                </div>
                <div className="h-[2px] flex-1 bg-[#b9f0d7]/30 mx-2 mt-[-20px]"></div>
                
                <div className="flex flex-col items-center gap-2 text-[#b8baff]">
                  <div className="w-6 h-6 rounded-full bg-[#b8baff]/20 flex items-center justify-center border border-[#b8baff]"><span className="w-2 h-2 bg-[#b8baff] rounded-full"></span></div>
                  <span>Tech Round 1</span>
                </div>
                <div className="h-[2px] flex-1 bg-white/10 mx-2 mt-[-20px]"></div>
                
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10"></div>
                  <span>HR Round</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
