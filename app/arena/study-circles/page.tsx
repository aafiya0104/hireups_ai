'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Plus } from 'lucide-react';

const circles = [
  { id: 'sc-1', name: 'Binary Search Ninjas', members: 6, focus: 'DSA + Contests' },
  { id: 'sc-2', name: 'Graph Masters', members: 5, focus: 'Graphs + DP' },
  { id: 'sc-3', name: 'Company OA Prep', members: 8, focus: 'Interview rounds' },
];

export default function StudyCirclesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/arena" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Arena
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Study Circles</h1>
          <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold transition-colors">
            <Plus className="w-4 h-4" />
            Create Circle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {circles.map((circle) => (
            <div key={circle.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h2 className="text-lg font-semibold mb-2">{circle.name}</h2>
              <p className="text-zinc-400 text-sm mb-4">{circle.focus}</p>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm text-zinc-300">
                  <Users className="w-4 h-4" />
                  {circle.members} members
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">Join</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
