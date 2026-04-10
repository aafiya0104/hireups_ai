"use client";

import { motion } from "framer-motion";
import { BookOpen, Code, FileText, Trophy, Target, Search } from "lucide-react";
import Link from "next/link";

const DashboardCard = ({ title, icon: Icon, color, delay, children }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-[#0c0c16]/50 border border-white/5 rounded-2xl p-6 backdrop-blur"
  >
    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
      <div className={`p-3 rounded-lg bg-${color}/10 text-${color}`}>
        <Icon size={24} />
      </div>
      <h2 className="text-xl font-heading font-bold">{title}</h2>
    </div>
    {children}
  </motion.div>
);

export default function StudentDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-r from-[#6666ff]/20 to-[#b8baff]/10 rounded-3xl p-8 border border-[#6666ff]/20 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6666ff] rounded-full blur-[100px] opacity-20" />
        <h1 className="text-4xl font-heading font-bold mb-2">Welcome back, Student</h1>
        <p className="text-gray-400 font-sans">Your placement readiness score is <span className="text-[#b9f0d7] font-bold">85%</span>. Let's hit 100%.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* AI Learning Roadmap */}
        <DashboardCard title="AI Roadmap" icon={BookOpen} color="[#6666ff]" delay={0.1}>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-sans">
              <span className="text-gray-400">Current Track: <strong className="text-white">Full-Stack dev</strong></span>
              <span className="text-[#6666ff]">Day 14/90</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div className="bg-[#6666ff] h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 mt-4">
              <h4 className="font-bold mb-1 font-sans">Today's Micro-Task</h4>
              <p className="text-sm text-gray-400 font-sans">Complete Advanced React Patterns (Hooks deeply).</p>
              <button className="mt-3 w-full py-2 bg-[#6666ff]/20 text-[#c9e8ff] rounded-lg text-sm font-semibold hover:bg-[#6666ff]/30 transition-colors">Start Day 14</button>
            </div>
          </div>
        </DashboardCard>

        {/* DSA Mastery Tracker */}
        <DashboardCard title="DSA Mastery" icon={Code} color="[#b9f0d7]" delay={0.2}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-xl border border-[#b9f0d7]/20 text-center">
                <div className="text-2xl font-bold text-[#b9f0d7]">124</div>
                <div className="text-xs text-gray-400">Problems Solved</div>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-[#b8baff]/20 text-center">
                <div className="text-2xl font-bold text-[#b8baff]">Top 15%</div>
                <div className="text-xs text-gray-400">Global Rank</div>
              </div>
            </div>
            <div className="pt-2">
              <h4 className="text-sm font-bold text-gray-300 font-sans mb-2">Weak Zones Flagged by AI</h4>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">Dynamic Programming</span>
                <span className="px-2 py-1 bg-orange-500/10 text-orange-400 text-xs rounded border border-orange-500/20">Graphs</span>
              </div>
            </div>
            <button className="w-full py-2 border border-white/10 text-white rounded-lg text-sm font-semibold hover:bg-white/5 transition-colors">View Dependency Graph</button>
          </div>
        </DashboardCard>

        {/* AI Portfolio Generator */}
        <DashboardCard title="ATS Portfolio" icon={FileText} color="[#b8baff]" delay={0.3}>
          <div className="h-full flex flex-col justify-between space-y-4">
            <p className="text-sm text-gray-400 font-sans">
              Connect your GitHub and let AI generate a deployed, ATS-friendly portfolio in 60 seconds.
            </p>
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-sans">GitHub Synced</span>
              </div>
              <span className="text-xs text-gray-500">Last updated: 2h ago</span>
            </div>
            <button className="w-full py-2 bg-[#b8baff] text-[#0c0c16] rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">Regenerate Portfolio</button>
          </div>
        </DashboardCard>

        {/* Virtual CP Arena */}
        <DashboardCard title="CP Arena" icon={Trophy} color="[#c9e8ff]" delay={0.4}>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#c9e8ff]/20 to-transparent p-4 rounded-xl border border-[#c9e8ff]/10">
              <div className="text-xs text-[#c9e8ff] font-bold mb-1 uppercase tracking-wider">Upcoming Contest</div>
              <h4 className="font-bold mb-1">Google OA Mock Round</h4>
              <p className="text-xs text-gray-400">Starts in 2h 45m • 5,432 enrolled</p>
            </div>
            <div className="flex gap-2">
               <button className="flex-1 py-2 bg-[#c9e8ff]/10 text-[#c9e8ff] rounded-lg text-sm font-semibold hover:bg-[#c9e8ff]/20 transition-colors">Join Arena</button>
               <button className="flex-1 py-2 border border-white/10 text-white rounded-lg text-sm font-semibold hover:bg-white/5 transition-colors">Leaderboard</button>
            </div>
          </div>
        </DashboardCard>

        {/* Companies to Target */}
        <DashboardCard title="Target Companies" icon={Target} color="[#b9f0d7]" delay={0.5}>
          <div className="space-y-3">
            {[
              { name: "Amazon", match: "92%", roles: "SDE-1", color: "text-green-400" },
              { name: "Microsoft", match: "85%", roles: "SWE", color: "text-[#b9f0d7]" },
              { name: "Flipkart", match: "78%", roles: "UI Engineer", color: "text-orange-400" }
            ].map((company) => (
              <div key={company.name} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                <div>
                  <h4 className="font-bold text-sm">{company.name}</h4>
                  <p className="text-xs text-gray-400">{company.roles}</p>
                </div>
                <div className={`text-sm font-bold ${company.color}`}>{company.match} Match</div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Past Drives */}
        <DashboardCard title="Past Drives" icon={Search} color="[#6666ff]" delay={0.6}>
           <div className="h-full flex flex-col justify-between">
            <p className="text-sm text-gray-400 font-sans mb-4">
              Search archival interview experiences compiled by graduated seniors.
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search 'Google SDE 2024'..." 
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#6666ff] transition-colors"
              />
            </div>
            <Link href="#" className="text-xs text-[#6666ff] text-right mt-4 hover:underline">View full archive →</Link>
          </div>
        </DashboardCard>

      </div>
    </div>
  );
}
