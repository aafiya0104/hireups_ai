"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, LayoutDashboard, Users, BrainCircuit, Rocket } from "lucide-react";
import { GradientWaveText } from "@/components/ui/gradient-wave-text";

const FeatureCard = ({ title, desc, icon: Icon, colorClass, link, glowColor }: any) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="p-6 rounded-2xl border border-zinc-100 bg-white hover:bg-zinc-50 transition-all overflow-hidden relative group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
  >
    <div className={`absolute -top-10 -right-10 w-40 h-40 ${glowColor} rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
    <div className="relative z-10">
      <Icon className={`w-10 h-10 mb-6 ${colorClass} drop-shadow-sm`} />
      <h3 className="text-xl font-heading font-bold mb-3 text-zinc-900">{title}</h3>
      <p className="text-zinc-600 font-sans mb-6 text-sm leading-relaxed">{desc}</p>
      <Link href={link} className={`inline-flex items-center text-sm font-bold ${colorClass} hover:opacity-80 transition-opacity`}>
        Explore Dashboard <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  </motion.div>
);

export const LandingPage = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-start overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 bg-white">

        {/* Refined Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6666ff] rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[28rem] h-[28rem] bg-[#b9f0d7] rounded-full blur-[150px] opacity-[0.08]" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 text-zinc-600 text-sm font-medium border border-zinc-200 mb-8 backdrop-blur-sm shadow-sm">
              <Rocket size={16} className="text-[#6666ff]" /> Welcome to the future of college placements
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-8 text-zinc-900 leading-tight"
          >
            Bridge the Gap to <br />
            <GradientWaveText repeat={true} className="inline-block md:text-7xl">Top Tech Placements</GradientWaveText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-zinc-600 font-sans max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            HireUps uses AI to connect placement cells with recruiters, helping students discover the right opportunities - faster, smarter, and scalable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/student" className="px-8 py-4 rounded-xl bg-zinc-900 text-white font-bold font-sans hover:bg-zinc-800 hover:scale-105 transition-all shadow-xl">
              Get Started for Students
            </Link>
            <Link href="/tpo" className="px-8 py-4 rounded-xl border border-zinc-200 text-zinc-600 font-bold font-sans hover:bg-zinc-50 hover:text-zinc-900 transition-all backdrop-blur-sm">
              Explore TPO Tools
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-zinc-900">One Platform. <br />Four Superpowers.</h2>
          <p className="text-zinc-600 font-sans">Every stakeholder connected through intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title="Student Hub"
            desc="Day-wise AI roadmap, checklist progress, streaks, rescheduling, and weak-topic tracking."
            icon={GraduationCap}
            colorClass="text-[#6666ff]"
            glowColor="bg-[#6666ff]"
            link="/student"
          />
          <FeatureCard
            title="CP Arena"
            desc="Monaco editor, code execution fallback, discussions, leaderboard, and ELO updates."
            icon={LayoutDashboard}
            colorClass="text-[#b9f0d7]"
            glowColor="bg-[#b9f0d7]"
            link="/arena"
          />
          <FeatureCard
            title="Drive Archive"
            desc="Company-wise placement experiences with filters, moderation, and student contributions."
            icon={Users}
            colorClass="text-[#b8baff]"
            glowColor="bg-[#b8baff]"
            link="/drives"
          />
          <FeatureCard
            title="Company Matching"
            desc="Skill-gap analysis with saved companies and application-stage tracking."
            icon={BrainCircuit}
            colorClass="text-[#c9e8ff]"
            glowColor="bg-[#c9e8ff]"
            link="/companies"
          />
        </div>
      </section>
    </div>
  );
};
