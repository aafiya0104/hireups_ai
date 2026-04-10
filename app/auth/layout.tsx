"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#0c0c16] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6666ff]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#b9f0d7]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-[#0c0c16]/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl relative z-10">
        
        {/* Left Side - Visual/Branding (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#1a1a2e] to-[#0c0c16] border-r border-white/5 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          
          <div>
            <Link href="/" className="flex items-center gap-2 mb-12 group">
              <div className="w-10 h-10 bg-[#6666ff] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(102,102,255,0.4)] group-hover:scale-110 transition-transform">
                <Rocket className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-heading font-extrabold tracking-tighter text-white">HireUps<span className="text-[#6666ff]">.ai</span></span>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl xl:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                Empowering the Next <br />
                Generation of <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6666ff] to-[#b9f0d7]">Tech Leaders.</span>
              </h1>
              <p className="text-zinc-400 font-sans text-lg max-w-md leading-relaxed">
                Join 500+ campuses and 10k+ students already accelerating their careers with AI-powered intelligence.
              </p>
            </motion.div>
          </div>

          <div className="space-y-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0c0c16] bg-zinc-800" />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#0c0c16] bg-[#6666ff] flex items-center justify-center text-[10px] font-bold text-white">
                +2k
              </div>
            </div>
            <p className="text-sm text-zinc-500 font-sans">
              Already trusted by students from Tier 1, 2, and 3 colleges.
            </p>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div className="p-8 lg:p-16 flex flex-col justify-center relative">
          {children}
        </div>
      </div>
    </div>
  );
}
