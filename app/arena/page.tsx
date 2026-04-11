'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Trophy, Clock, Users, Play, Calendar, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import ArenaHeader from './components/ArenaHeader';
import ContestCard from './components/ContestCard';
import ContestResultsCard from './components/ContestResultsCard';
import CountdownTimer from './components/CountdownTimer';

interface ActiveContest {
  _id: string;
  name: string;
  type: string;
  status: string;
  participantCount: number;
  problemCount: number;
  startTime: string;
  endTime: string;
  timeRemaining: number;
}

interface UpcomingContest {
  _id: string;
  name: string;
  company?: string;
  type: string;
  startTime: string;
  endTime: string;
  duration: number;
  difficulty: string;
  problemCount: number;
}

export default function ArenaHubPage() {
  const router = useRouter();
  const [activeContests, setActiveContests] = useState<ActiveContest[]>([]);
  const [upcomingContests, setUpcomingContests] = useState<UpcomingContest[]>([]);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch('/api/arena/contests');
        const data = await response.json();
        setActiveContests(data.active || []);
        setUpcomingContests(data.upcoming || []);
        
        // TODO: Fetch recent results separately
        setRecentResults([
          {
            _id: 'result-1',
            contestName: 'Weekly Contest #44',
            rank: 15,
            totalScore: 420,
            problemsSolved: 3,
            ratingChange: 42,
          },
          {
            _id: 'result-2',
            contestName: 'GeeksforGeeks Round',
            rank: 28,
            totalScore: 320,
            problemsSolved: 2,
            ratingChange: -18,
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch contests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const handleJoinContest = (contestID: string) => {
    router.push(`/arena/contests/${contestID}/lobby`);
  };

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <ArenaHeader />

      {/* Active Contest Banner */}
      {activeContests.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 mx-4 mt-8 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-red-400">LIVE NOW</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{activeContests[0].name}</h2>
              <div className="flex gap-6 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {activeContests[0].participantCount} participants
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <CountdownTimer seconds={activeContests[0].timeRemaining * 60} />
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  {activeContests[0].problemCount} problems
                </div>
              </div>
            </div>
            <button
              onClick={() => handleJoinContest(activeContests[0]._id)}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              Enter Contest
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Contests */}
      <div className="mx-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Upcoming Contests
          </h3>
          <Link href="/arena/contests" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingContests.map((contest) => (
            <ContestCard key={contest._id} contest={contest} />
          ))}
        </div>
      </div>

      {/* Recent Contest Results */}
      <div className="mx-4 mt-12 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Your Recent Results
          </h3>
          <Link href="/arena/profile" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm">
            View profile <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentResults.map((result) => (
            <ContestResultsCard key={result._id} result={result} />
          ))}
        </div>
      </div>

      {/* Study Circles CTA */}
      <div className="mx-4 mb-12 bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Join a Study Circle</h3>
        <p className="text-zinc-400 mb-4">Study with 4-8 people in focused groups, share approaches, and grow together</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/arena/study-circles"
            className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Explore Study Circles
          </Link>
          <Link
            href="/arena/vr"
            className="inline-block bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Enter VR Room
          </Link>
        </div>
      </div>
    </div>
  );
}
