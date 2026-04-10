"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, User, GraduationCap, Terminal, Globe, Check } from "lucide-react";

export default function SignupPage() {
  const [agreed, setAgreed] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-white mb-2">Join HireUps</h2>
        <p className="text-zinc-400 font-sans">Start your AI-accelerated placement journey today.</p>
      </motion.div>

      {/* Social Register */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-6">
        <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
          <Terminal className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold text-white">GitHub</span>
        </button>
        <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
          <Globe className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold text-white">Google</span>
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="relative mb-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <span className="relative px-4 text-xs uppercase tracking-widest text-zinc-500 bg-[#0c0c16]/50">Or use email</span>
      </motion.div>

      <form className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#6666ff]" />
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full bg-[#0c0c16] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-[#6666ff] transition-all"
              />
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 ml-1">University</label>
            <div className="relative group">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#6666ff]" />
              <input 
                type="text" 
                placeholder="MIT"
                className="w-full bg-[#0c0c16] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-[#6666ff] transition-all"
              />
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#6666ff]" />
            <input 
              type="email" 
              placeholder="john@example.com"
              className="w-full bg-[#0c0c16] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-[#6666ff] transition-all"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 ml-1">Create Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#6666ff]" />
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-[#0c0c16] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-[#6666ff] transition-all"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-start gap-3 py-2">
          <button 
            type="button"
            onClick={() => setAgreed(!agreed)}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${agreed ? 'bg-[#6666ff] border-[#6666ff]' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
          >
            {agreed && <Check className="w-3 h-3 text-white" />}
          </button>
          <p className="text-xs text-zinc-500 font-sans leading-relaxed">
            I agree to the <Link href="#" className="text-zinc-300 hover:text-[#b8baff] underline">Terms of Service</Link> and <Link href="#" className="text-zinc-300 hover:text-[#b8baff] underline">Privacy Policy</Link>.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-2">
          <button 
            type="submit"
            className="w-full bg-white text-[#0c0c16] hover:bg-[#b8baff] font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Create My Account
          </button>
        </motion.div>
      </form>

      <motion.p variants={itemVariants} className="mt-8 text-center text-zinc-400 font-sans">
        Already have an account? <Link href="/auth/login" className="text-[#6666ff] font-bold hover:underline">Log in</Link>
      </motion.p>
    </motion.div>
  );
}
