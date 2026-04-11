'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Trophy, ChevronRight, Building2 } from 'lucide-react';

interface Contest {
  _id: string;
  name: string;
  company?: string;
  type: string;
  startTime: string;
  endTime: string;
  duration: number;
  difficulty?: string;
  problemCount: number;
}

export default function ContestCard({ contest }: { contest: Contest }) {
  const router = useRouter();
  const startDate = new Date(contest.startTime);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const difficultyColor =
    contest.difficulty === 'easy'
      ? 'text-green-400 bg-green-400/10'
      : contest.difficulty === 'medium'
        ? 'text-yellow-400 bg-yellow-400/10'
        : 'text-red-400 bg-red-400/10';

  return (
    <Link href={`/arena/contests/${contest._id}/lobby`}>
      <div className="bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 rounded-lg p-4 cursor-pointer transition-all hover:bg-zinc-800/50 group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {contest.company && (
                <>
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-blue-400">{contest.company}</span>
                </>
              )}
            </div>
            <h4 className="font-semibold group-hover:text-blue-400 transition-colors">{contest.name}</h4>
          </div>
          {contest.difficulty && <span className={`text-xs px-2 py-1 rounded font-semibold ${difficultyColor}`}>{contest.difficulty}</span>}
        </div>

        <div className="space-y-2 text-sm text-zinc-400 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-500" />
            {formattedDate} at {formattedTime}
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-zinc-500" />
            {contest.duration} minutes • {contest.problemCount} problems
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <button
            onClick={(e) => {
              e.preventDefault();
              router.push(`/arena/contests/${contest._id}/lobby`);
            }}
            className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            Register <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </Link>
  );
}
