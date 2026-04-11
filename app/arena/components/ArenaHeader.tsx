'use client';

import Link from 'next/link';
import { Zap, Target, MessageSquare, Users } from 'lucide-react';

export default function ArenaHeader() {
  return (
    <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-full px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/arena" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            ⚡ CP Arena
          </Link>
          <div className="hidden md:flex gap-1">
            <Link
              href="/arena"
              className="px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 rounded transition-colors"
            >
              Home
            </Link>
            <Link
              href="/arena/contests"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            >
              Contests
            </Link>
            <Link
              href="/arena/leaderboard"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/arena/community"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            >
              Community
            </Link>
            <Link
              href="/arena/challenges"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            >
              Challenges
            </Link>
            <Link
              href="/arena/vr"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            >
              VR Room
            </Link>
            <Link
              href="/arena/profile"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-zinc-800/50 rounded p-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-zinc-400">Rating</div>
              <div className="font-semibold">1856</div>
            </div>
          </div>
          <div className="bg-zinc-800/50 rounded p-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            <div>
              <div className="text-zinc-400">Problems</div>
              <div className="font-semibold">234</div>
            </div>
          </div>
          <div className="bg-zinc-800/50 rounded p-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-zinc-400">Contests</div>
              <div className="font-semibold">18</div>
            </div>
          </div>
          <div className="bg-zinc-800/50 rounded p-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-400" />
            <div>
              <div className="text-zinc-400">Rank</div>
              <div className="font-semibold">#342 IN</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
