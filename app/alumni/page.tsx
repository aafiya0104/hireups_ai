"use client";

import { motion } from "framer-motion";
import { History, HeartHandshake, CheckCircle, BellRing } from "lucide-react";

export default function AlumniDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#c9e8ff]/20 to-transparent border border-[#c9e8ff]/20 rounded-3xl p-12 overflow-hidden relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c9e8ff] rounded-full blur-[120px] opacity-10" />
        <div className="z-10 relative">
          <h1 className="text-4xl font-heading font-bold mb-4">Give Back to Your Alma Mater</h1>
          <p className="text-gray-400 font-sans max-w-2xl mx-auto text-lg mb-6">
            You walked these halls. Now, help the next generation step through the doors of top tech companies.
          </p>
          <div className="flex items-center justify-center gap-4">
             <button className="px-6 py-3 bg-[#c9e8ff] text-[#0c0c16] font-bold rounded-xl shadow-[0_0_15px_rgba(201,232,255,0.4)] hover:scale-105 transition-transform">
               Post Interview Experience
             </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Previous Drives Archive */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0c0c16]/50 border border-white/5 rounded-2xl p-6 backdrop-blur space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
            <div className="p-3 rounded-lg bg-[#b8baff]/10 text-[#b8baff]">
              <History size={24} />
            </div>
            <h2 className="text-xl font-heading font-bold">Your Drive Year (2020)</h2>
          </div>
          <p className="text-sm font-sans text-gray-400">Revisit memories and see how your batch performed.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 p-4 border border-white/5 rounded-xl">
              <span className="text-2xl font-bold block mb-1">112</span>
              <span className="text-xs text-gray-400">Companies Visited</span>
            </div>
            <div className="bg-black/40 p-4 border border-white/5 rounded-xl">
              <span className="text-2xl font-bold block mb-1 text-[#b9f0d7]">₹9.2L</span>
              <span className="text-xs text-gray-400">Avg Tech Package</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-sm mb-3 mt-6">Missing Data from your peers?</h4>
            <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              Submit rounds faced & tips
            </button>
          </div>

        </motion.div>

        {/* Mentorship & Mock Interviews */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0c0c16]/50 border border-white/5 rounded-2xl p-6 backdrop-blur flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
              <div className="p-3 rounded-lg bg-[#6666ff]/10 text-[#6666ff]">
                <HeartHandshake size={24} />
              </div>
              <h2 className="text-xl font-heading font-bold">Mentorship Opt-in</h2>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 border border-[#6666ff]/20 bg-[#6666ff]/5 rounded-xl cursor-pointer hover:bg-[#6666ff]/10 transition-colors">
                <input type="checkbox" className="mt-1" defaultChecked />
                <div>
                  <h4 className="font-bold text-sm">Mock Interviewer</h4>
                  <p className="text-xs text-gray-400 mt-1">Available 2hrs/month for mock DSA/System Design rounds.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-white/5 bg-black/40 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                <input type="checkbox" className="mt-1" />
                <div>
                  <h4 className="font-bold text-sm">Referral Contact</h4>
                  <p className="text-xs text-gray-400 mt-1">Students can request referrals if they match your company JD.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between p-4 bg-[#b9f0d7]/10 border border-[#b9f0d7]/20 rounded-xl">
             <div className="flex items-center gap-2">
               <CheckCircle className="text-[#b9f0d7]" size={20} />
               <span className="text-sm font-bold text-[#b9f0d7]">Verified Contributor</span>
             </div>
             <span className="text-xs text-gray-400">Top 10% Alumni Mentor</span>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
