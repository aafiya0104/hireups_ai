"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0c0c16]/80 border-b border-[#6666ff]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6666ff] to-[#b8baff]">
                HireUps
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center font-sans text-sm font-medium text-[#ededed]">
            <Link href="/student" className="hover:text-[#b9f0d7] transition-colors">Students</Link>
            <Link href="/tpo/dashboard" className="hover:text-[#c9e8ff] transition-colors">TPO Dashboard</Link>
            <Link href="/recruiter" className="hover:text-[#b8baff] transition-colors">Recruiters</Link>
            <Link href="/alumni" className="hover:text-[#6666ff] transition-colors">Alumni</Link>
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
              <Link href="/auth/login" className="hover:text-[#6666ff] transition-colors">
                Login
              </Link>
              <Link href="/auth/signup" className="px-5 py-2 rounded-full bg-[#6666ff] text-white hover:bg-[#b8baff] hover:text-[#0c0c16] font-bold shadow-[0_0_15px_rgba(102,102,255,0.3)] hover:shadow-[0_0_20px_rgba(102,102,255,0.5)] transition-all">
                Get Started
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#ededed] hover:text-[#6666ff]">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-[#0c0c16] border-b border-[#6666ff]/20"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col font-sans">
            <Link href="/student" className="block px-3 py-2 text-base font-medium text-[#ededed] hover:text-[#b9f0d7]">Students</Link>
            <Link href="/tpo/dashboard" className="block px-3 py-2 text-base font-medium text-[#ededed] hover:text-[#c9e8ff]">TPOs</Link>
            <Link href="/recruiter" className="block px-3 py-2 text-base font-medium text-[#ededed] hover:text-[#b8baff]">Recruiters</Link>
            <Link href="/alumni" className="block px-3 py-2 text-base font-medium text-[#ededed] hover:text-[#6666ff]">Alumni</Link>
            <div className="pt-4 space-y-2 border-t border-white/10 mt-2">
              <Link href="/auth/login" className="block px-3 py-3 rounded-xl text-center font-bold text-[#ededed] border border-white/10 hover:bg-white/5 transition-all">
                Login
              </Link>
              <Link href="/auth/signup" className="block px-3 py-3 rounded-xl text-center font-bold text-white bg-[#6666ff] hover:bg-[#b8baff] transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
