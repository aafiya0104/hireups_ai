'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Swords, Plus, Clock } from 'lucide-react';

type ChallengeStatus = 'pending' | 'accepted' | 'in-progress' | 'completed';

interface Challenge {
  id: string;
  challenger: string;
  opponent: string;
  problemTitle: string;
  language: 'cpp' | 'java' | 'python';
  duration: number;
  status: ChallengeStatus;
  createdAt: string;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    challenger: 'You',
    opponent: '',
    problemTitle: '',
    language: 'cpp' as 'cpp' | 'java' | 'python',
    duration: 20,
  });

  const loadChallenges = async () => {
    try {
      const res = await fetch('/api/arena/challenges');
      const data = await res.json();
      setChallenges(data.challenges || []);
    } catch (error) {
      console.error('Failed to load challenges', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const createChallenge = async () => {
    if (!form.opponent || !form.problemTitle) {
      return;
    }

    const res = await fetch('/api/arena/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ ...form, opponent: '', problemTitle: '' });
      loadChallenges();
    }
  };

  const updateStatus = async (id: string, status: ChallengeStatus) => {
    const res = await fetch('/api/arena/challenges', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });

    if (res.ok) {
      loadChallenges();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/arena" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Arena
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <Swords className="w-6 h-6 text-red-400" />
          <h1 className="text-3xl font-bold">Challenge a Friend</h1>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-6">
          <h2 className="font-semibold mb-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Challenge
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              value={form.opponent}
              onChange={(e) => setForm({ ...form, opponent: e.target.value })}
              placeholder="Opponent name"
              className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
            />
            <input
              value={form.problemTitle}
              onChange={(e) => setForm({ ...form, problemTitle: e.target.value })}
              placeholder="Problem title"
              className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
            />
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value as 'cpp' | 'java' | 'python' })}
              className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
            <select
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
            >
              <option value={15}>15 min</option>
              <option value={20}>20 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
            </select>
            <button
              onClick={createChallenge}
              className="bg-red-600 hover:bg-red-700 rounded px-4 py-2 font-semibold text-sm transition-colors"
            >
              Send Challenge
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800 font-semibold">Open Challenges</div>
          {loading ? (
            <div className="p-5 text-zinc-400">Loading challenges...</div>
          ) : challenges.length === 0 ? (
            <div className="p-5 text-zinc-400">No challenges yet.</div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <div className="font-semibold">{challenge.challenger} vs {challenge.opponent}</div>
                    <div className="text-sm text-zinc-400">{challenge.problemTitle} • {challenge.language.toUpperCase()} • {challenge.duration} min</div>
                    <div className="text-xs text-zinc-500 mt-1 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(challenge.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700 uppercase">{challenge.status}</span>
                    {challenge.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(challenge.id, 'accepted')}
                        className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                      >
                        Accept
                      </button>
                    )}
                    {challenge.status === 'accepted' && (
                      <button
                        onClick={() => updateStatus(challenge.id, 'in-progress')}
                        className="text-sm px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
                      >
                        Start
                      </button>
                    )}
                    {challenge.status === 'in-progress' && (
                      <button
                        onClick={() => updateStatus(challenge.id, 'completed')}
                        className="text-sm px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
