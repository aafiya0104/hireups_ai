import Link from "next/link";
import { Code, Map, GraduationCap, Users, LayoutDashboard, BrainCircuit, Rocket } from "lucide-react";

const FeatureCard = ({ title, desc, icon: Icon, colorClass, link, glowColor }: any) => (
  <div className="p-6 rounded-2xl border border-white/5 bg-[#0c0c16] hover:bg-zinc-900/50 transition-all overflow-hidden relative group shadow-lg hover:-translate-y-2">
    <div className={`absolute -top-10 -right-10 w-40 h-40 ${glowColor} rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
    <div className="relative z-10">
      <Icon className={`w-10 h-10 mb-6 ${colorClass} drop-shadow-md`} />
      <h3 className="text-xl font-heading font-bold mb-3 text-zinc-100">{title}</h3>
      <p className="text-zinc-400 font-sans mb-6 text-sm">{desc}</p>
      <Link href={link} className={`inline-flex items-center text-sm font-bold ${colorClass} hover:opacity-80 transition-opacity`}>
        Explore Dashboard <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-start overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        
        {/* Refined Background Gradients - Reduced Opacity */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6666ff] rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[28rem] h-[28rem] bg-[#b9f0d7] rounded-full blur-[150px] opacity-[0.08]" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="animate-[fade-in_0.7s_ease-out_both]">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-zinc-300 text-sm font-medium border border-white/10 mb-8 backdrop-blur-sm shadow-xl">
              <Rocket size={16} className="text-[#b9f0d7]" /> Welcome to the future of college placements
            </span>
          </div>

          <h1 
            className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-8 text-white leading-tight"
          >
            Bridge the Gap to <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6666ff] via-[#b8baff] to-[#b9f0d7]">Top Tech Placements</span>
          </h1>

          <p 
            className="text-xl text-zinc-400 font-sans max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The all-in-one AI OS designed for students to prepare, TPOs to orchestrate, and recruiters to discover exceptional talent.
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/student" className="px-8 py-4 rounded-xl bg-zinc-100 text-zinc-900 font-bold font-sans hover:bg-white hover:scale-105 transition-all shadow-lg">
              Get Started for Students
            </Link>
            <Link href="/tpo" className="px-8 py-4 rounded-xl border border-white/10 text-zinc-300 font-bold font-sans hover:bg-white/5 hover:text-white transition-all backdrop-blur-sm">
              Explore TPO Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">One Platform. <br/>Four Superpowers.</h2>
          <p className="text-zinc-400 font-sans">Every stakeholder connected through intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            title="Student Hub"
            desc="AI learning roadmaps, real-time LeetCode syncing, and automated ATS portfolios."
            icon={GraduationCap}
            colorClass="text-[#6666ff]"
            glowColor="bg-[#6666ff]"
            link="/student"
          />
          <FeatureCard 
            title="TPO Dashboard"
            desc="AI recruiter discovery, alumni radar, and automated hyper-personalized outreach."
            icon={LayoutDashboard}
            colorClass="text-[#b9f0d7]"
            glowColor="bg-[#b9f0d7]"
            link="/tpo"
          />
          <FeatureCard 
            title="Recruiter Suite"
            desc="Discover AI-curated student shortlists matched perfectly to your JD."
            icon={Users}
            colorClass="text-[#b8baff]"
            glowColor="bg-[#b8baff]"
            link="/recruiter"
          />
          <FeatureCard 
            title="Alumni Network"
            desc="Give back by sharing previous interview drives, offering mentorship, and boosting college rank."
            icon={BrainCircuit}
            colorClass="text-[#c9e8ff]"
            glowColor="bg-[#c9e8ff]"
            link="/alumni"
          />
        </div>
      </section>
    </div>
  );
}
