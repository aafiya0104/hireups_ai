"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Terminal, Globe, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    router.push("/student");
  };

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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-zinc-400 font-sans">Enter your details to access your dashboard.</p>
      </motion.div>

      {/* Social Login */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={handleLogin} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
          <Terminal className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold text-white">GitHub</span>
        </button>
        <button onClick={handleLogin} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
          <Globe className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold text-white">Google</span>
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="relative mb-8 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <span className="relative px-4 text-xs uppercase tracking-widest text-zinc-500 bg-[#0c0c16]/50">Or continue with</span>
      </motion.div>

      <form onSubmit={handleLogin} className="space-y-5">
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-bold text-zinc-300 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-[#6666ff] transition-colors" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              className="w-full bg-[#0c0c16] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#6666ff] focus:ring-1 focus:ring-[#6666ff]/20 transition-all"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-bold text-zinc-300">Password</label>
            <Link href="/auth/forgot-password" className="text-xs text-[#6666ff] hover:text-[#b8baff] font-bold">Forgot password?</Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-[#6666ff] transition-colors" />
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0c0c16] border border-white/5 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#6666ff] focus:ring-1 focus:ring-[#6666ff]/20 transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-2">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#6666ff] hover:bg-[#b8baff] text-white hover:text-[#0c0c16] font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(102,102,255,0.2)] hover:shadow-[0_0_20px_rgba(102,102,255,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </motion.div>
      </form>

      <motion.p variants={itemVariants} className="mt-8 text-center text-zinc-400 font-sans">
        Don't have an account? <Link href="/auth/signup" className="text-[#6666ff] font-bold hover:underline">Create an account</Link>
      </motion.p>
    </motion.div>
  );
}
