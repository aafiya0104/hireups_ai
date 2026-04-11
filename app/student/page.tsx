import { BookOpen, Code, FileText, Trophy, Target, Search, Map, ArrowRight } from "lucide-react";
import Link from "next/link";

const DashboardCard = ({ title, icon: Icon, color, delay, children }: any) => (
  <div className="bg-[#0c0c16]/50 border border-white/5 rounded-2xl p-6 backdrop-blur">
    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
      <div className={`p-3 rounded-lg bg-${color}/10 text-${color}`}>
        <Icon size={24} />
      </div>
      <h2 className="text-xl font-heading font-bold">{title}</h2>
    </div>
    {children}
  </div>
);

export default function StudentDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#6666ff]/20 to-[#b8baff]/10 rounded-3xl p-8 border border-[#6666ff]/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6666ff] rounded-full blur-[100px] opacity-20" />
        <h1 className="text-4xl font-heading font-bold mb-2">Welcome back, Student</h1>
        <p className="text-gray-400 font-sans">Your placement readiness score is <span className="text-[#b9f0d7] font-bold">85%</span>. Let's hit 100%.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* AI Learning Roadmap — full feature entry */}
        <div className="bg-gradient-to-br from-[#6666ff]/10 to-[#b8baff]/5 border border-[#6666ff]/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#6666ff] rounded-full blur-[80px] opacity-10 pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-[#6666ff]/10 text-[#6666ff]">
              <Map size={24} />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold">AI Learning Roadmap</h2>
              <p className="text-xs text-zinc-400">Week 3 of 12 · Trees &amp; Recursion</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="text-zinc-400">Day 18 of 90</span>
            <span className="text-[#b9f0d7] font-bold bg-[#b9f0d7]/10 px-2 py-0.5 rounded-full border border-[#b9f0d7]/20">On track ✓</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2 mb-4">
            <div className="bg-gradient-to-r from-[#6666ff] to-[#b8baff] h-2 rounded-full" style={{ width: '20%' }} />
          </div>
          <div className="bg-black/30 p-3 rounded-xl border border-white/5 mb-4">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Today</p>
            <p className="text-sm font-semibold text-white">Binary Search Trees + OS Scheduling</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] bg-[#6666ff]/20 text-[#b8baff] px-2 py-0.5 rounded">DSA</span>
              <span className="text-[10px] bg-[#b9f0d7]/10 text-[#b9f0d7] px-2 py-0.5 rounded">OS</span>
              <span className="text-[10px] text-zinc-500">~90 min</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xl">🔥</span>
              <span className="font-bold text-white">7</span>
              <span className="text-zinc-400 text-xs">day streak</span>
            </div>
            <Link href="/student/roadmap" className="flex items-center gap-1.5 px-4 py-2 bg-[#6666ff] text-white text-sm font-bold rounded-lg hover:bg-[#b8baff] hover:text-zinc-900 transition-all">
              Open Roadmap <ArrowRight size={14} />
            </Link>
          </div>
        </div>

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
