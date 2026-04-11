'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Trophy, TrendingUp } from 'lucide-react';

export default function ResultDetailsPage() {
  const params = useParams();
  const resultId = params.resultId as string;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/arena" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Arena
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Contest Result</h1>
          <p className="text-zinc-400 text-sm">Result ID: {resultId}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-zinc-400 text-sm">Rank</div>
            <div className="text-2xl font-bold text-yellow-400 inline-flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              #15
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-zinc-400 text-sm">Score</div>
            <div className="text-2xl font-bold text-green-400">420</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-zinc-400 text-sm">Rating Change</div>
            <div className="text-2xl font-bold text-blue-400 inline-flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              +42
            </div>
          </div>
        </div>

        <Link href="/arena/editorial" className="inline-block bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded font-semibold transition-colors">
          View Editorial
        </Link>
      </div>
    </div>
  );
}
