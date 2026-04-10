"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Send, BarChart3, Database, TrendingUp, Users } from "lucide-react";

export default function TPODashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0c0c16] border-b border-white/5 pb-8"
      >
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Placement Command Center</h1>
          <p className="text-gray-400 font-sans">Live analytics, recruiter discovery, and automated outreach pipeline.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#b9f0d7]/10 text-[#b9f0d7] font-semibold border border-[#b9f0d7]/20 rounded-lg hover:bg-[#b9f0d7]/20 transition-all">Export Report</button>
          <button className="px-4 py-2 bg-[#6666ff] text-white font-semibold rounded-lg hover:bg-[#b8baff] hover:text-[#0c0c16] transition-all">New Campaign</button>
        </div>
      </motion.div>

      {/* KPI Tiles */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Offers", value: "342", trend: "+12%", color: "text-[#b9f0d7]", bg: "bg-[#b9f0d7]/10", border: "border-[#b9f0d7]/20" },
          { label: "Avg CTC", value: "₹8.4 LPA", trend: "+5%", color: "text-[#c9e8ff]", bg: "bg-[#c9e8ff]/10", border: "border-[#c9e8ff]/20" },
          { label: "Placement Rate", value: "78%", trend: "+2%", color: "text-[#b8baff]", bg: "bg-[#b8baff]/10", border: "border-[#b8baff]/20" },
          { label: "Active Companies", value: "45", trend: "+8", color: "text-[#6666ff]", bg: "bg-[#6666ff]/10", border: "border-[#6666ff]/20" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#0c0c16]/50 border border-white/5 rounded-2xl p-6 backdrop-blur">
            <h4 className="text-sm text-gray-400 font-sans mb-2">{kpi.label}</h4>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-heading font-bold">{kpi.value}</span>
              <span className={`text-xs font-bold ${kpi.color} ${kpi.bg} px-2 py-1 rounded-md mb-1`}>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Recruiter Discovery */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0c0c16]/50 border border-white/5 rounded-2xl p-6 backdrop-blur"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                <Search className="text-[#b8baff]" /> AI Recruiter Discovery
              </h2>
              <span className="text-xs bg-[#b8baff]/10 text-[#b8baff] px-2 py-1 rounded border border-[#b8baff]/20">Scraping Live</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="pb-3 font-medium">Company</th>
                    <th className="pb-3 font-medium">Match %</th>
                    <th className="pb-3 font-medium">Hiring Volume</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: "TechNova Solutions", match: 94, vol: "High" },
                    { name: "FinServe Global", match: 88, vol: "Medium" },
                    { name: "CloudScale Inc", match: 85, vol: "Low" }
                  ].map((co, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-semibold">{co.name}</td>
                      <td className="py-4 text-[#b9f0d7]">{co.match}%</td>
                      <td className="py-4">{co.vol}</td>
                      <td className="py-4">
                        <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors">+ Pipeline</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* AI Outreach */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0c0c16]/50 border border-white/5 rounded-2xl p-6 backdrop-blur"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                <Send className="text-[#6666ff]" /> AI Outreach Campaigns
              </h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#6666ff]/10 to-transparent p-4 rounded-xl border border-[#6666ff]/20">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">Fintech Drive 2025</h4>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
                </div>
                <div className="flex gap-6 mt-4 text-sm text-gray-400">
                  <span>Sent: <strong>142</strong></span>
                  <span>Opened: <strong className="text-[#b9f0d7]">68%</strong></span>
                  <span>Replies: <strong className="text-[#6666ff]">14%</strong></span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Sidebar Area (1 col) */}
        <div className="space-y-8">
          
          {/* Alumni Radar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0c0c16]/50 border border-white/5 rounded-2xl p-6 backdrop-blur"
          >
            <h2 className="text-xl font-heading font-bold flex items-center gap-2 mb-6">
              <MapPin className="text-[#c9e8ff]" /> Alumni Radar
            </h2>
            <div className="space-y-4">
              {[
                { name: "Rahul Verma", role: "SDE-2 at Amazon", tag: "Active" },
                { name: "Priya Sharma", role: "Engineering Mgr at Google", tag: "Mentoring" }
              ].map((alumni, i) => (
                <div key={i} className="bg-black/40 p-3 rounded-lg border border-white/5">
                  <h4 className="font-bold text-sm">{alumni.name}</h4>
                  <p className="text-xs text-gray-400 mb-2">{alumni.role}</p>
                  <span className="text-[10px] uppercase tracking-wider bg-[#c9e8ff]/20 text-[#c9e8ff] px-2 py-0.5 rounded-sm">{alumni.tag}</span>
                </div>
              ))}
              <button className="w-full py-2 border border-white/10 text-white rounded-lg text-sm hover:bg-white/5 transition-colors mt-2">View Full Graph</button>
            </div>
          </motion.div>

          {/* Past Drives Archive */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#0c0c16]/50 border border-white/5 rounded-2xl p-6 backdrop-blur"
          >
            <h2 className="text-xl font-heading font-bold flex items-center gap-2 mb-6">
              <Database className="text-[#b8baff]" /> Drive Archive
            </h2>
            <p className="text-sm text-gray-400 mb-4 font-sans">
              Benchmark current batch against historical data.
            </p>
            <button className="w-full py-2 bg-[#b8baff]/10 text-[#b8baff] border border-[#b8baff]/20 rounded-lg text-sm font-semibold hover:bg-[#b8baff]/20 transition-colors">Compare 2024 vs 2025</button>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
