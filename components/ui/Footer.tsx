import Link from "next/link";
import { Mail, Globe, MessageSquare, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0c0c16] border-t border-[#6666ff]/20 text-[#ededed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <span className="text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6666ff] to-[#b8baff]">
              HireUps
            </span>
            <p className="text-sm text-gray-400 mt-2 font-sans">
              AI-powered placement intelligence platform bridging the gap between Tier 2/3 engineering colleges and top companies.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold text-[#b9f0d7] mb-4">Platform</h3>
            <ul className="space-y-2 text-sm font-sans">
              <li><Link href="/student" className="hover:text-[#6666ff] transition-colors">Student Hub</Link></li>
              <li><Link href="/tpo/dashboard" className="hover:text-[#6666ff] transition-colors">TPO Portal</Link></li>
              <li><Link href="/recruiter" className="hover:text-[#6666ff] transition-colors">Recruiter Suite</Link></li>
              <li><Link href="/alumni" className="hover:text-[#6666ff] transition-colors">Alumni Network</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold text-[#c9e8ff] mb-4">Resources</h3>
            <ul className="space-y-2 text-sm font-sans">
              <li><Link href="#" className="hover:text-[#6666ff] transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-[#6666ff] transition-colors">Placement Guides</Link></li>
              <li><Link href="#" className="hover:text-[#6666ff] transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-[#6666ff] transition-colors">Success Stories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold text-[#b8baff] mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#6666ff] transition-colors"><Globe size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#b8baff] transition-colors"><MessageSquare size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#b9f0d7] transition-colors"><Phone size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#c9e8ff] transition-colors"><Mail size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#6666ff]/20 text-sm text-center text-gray-500 font-sans">
          &copy; {new Date().getFullYear()} HireUps AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
