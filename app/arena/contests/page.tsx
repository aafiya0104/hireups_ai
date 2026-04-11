'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import ArenaHeader from '../components/ArenaHeader';
import ContestCard from '../components/ContestCard';

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

export default function ArenaContestsPage() {
  const [activeContests, setActiveContests] = useState<Contest[]>([]);
  const [upcomingContests, setUpcomingContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/arena/contests');
        const data = await res.json();
        setActiveContests(data.active || []);
        setUpcomingContests(data.upcoming || []);
      } catch (error) {
        console.error('Failed to load contests', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Loading contests...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <ArenaHeader />
      <div className="mx-4 mt-6">
        <Link href="/arena" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Arena
        </Link>

        {activeContests.length > 0 && (
          <section className="mb-10">
            <h1 className="text-2xl font-bold mb-4">Live Contests</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeContests.map((contest) => (
                <ContestCard key={contest._id} contest={contest} />
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Upcoming Contests
          </h2>
          {upcomingContests.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-zinc-400">No upcoming contests yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingContests.map((contest) => (
                <ContestCard key={contest._id} contest={contest} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
