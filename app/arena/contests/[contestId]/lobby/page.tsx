'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Clock, Trophy, BookOpen, AlertCircle } from 'lucide-react';
import CountdownTimer from '../../../components/CountdownTimer';
import ParticipantList from '../../../components/ParticipantList';

interface Contest {
  _id: string;
  name: string;
  description?: string;
  duration: number;
  problemCount: number;
  startTime: string;
  endTime: string;
  status: string;
  rules?: string[];
  participantCount?: number;
}

export default function ContestLobbyPage() {
  const params = useParams();
  const router = useRouter();
  const contestID = params.contestId as string;
  const [contest, setContest] = useState<Contest | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [timeUntilStart, setTimeUntilStart] = useState(0);

  useEffect(() => {
    // Fetch contest details
    // TODO: Replace with actual API call
    setContest({
      _id: contestID,
      name: 'Weekly Contest #45',
      description: 'A competitive programming contest with problems from various difficulty levels',
      duration: 120,
      problemCount: 4,
      startTime: new Date(Date.now() + 300000).toISOString(),
      endTime: new Date(Date.now() + 300000 + 120 * 60 * 1000).toISOString(),
      status: 'upcoming',
      rules: [
        'You can code in C++, Java, or Python',
        'Multiple submissions are allowed',
        'Hacking is not allowed in this contest',
        'Penalty: 1 minute for each wrong submission',
        'Contest ends after 2 hours',
      ],
      participantCount: 234,
    });

    setParticipants([
      { id: 1, name: 'Aarav Mehta', college: 'NIT Surathkal', avatar: 'AM' },
      { id: 2, name: 'Priya Sharma', college: 'IIT Delhi', avatar: 'PS' },
      { id: 3, name: 'Ravi Kumar', college: 'BITS Pilani', avatar: 'RK' },
      { id: 4, name: 'Anjali Patel', college: 'NIT Mumbai', avatar: 'AP' },
      { id: 5, name: 'Vikram Singh', college: 'IIT Bombay', avatar: 'VS' },
    ]);

    setHasJoined(true);
    setLoading(false);
    setTimeUntilStart(5 * 60); // 5 minutes until start
  }, [contestID]);

  const handleStartContest = () => {
    router.push(`/arena/contests/${contestID}/contest`);
  };

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p>Contest not found</p>
          <Link href="/arena" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
            Back to Arena
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4">
        <Link href="/arena" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Arena
        </Link>
        <h1 className="text-3xl font-bold">{contest.name}</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contest Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Countdown */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">Time until contest starts:</span>
              </div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                <CountdownTimer seconds={timeUntilStart} />
              </div>
            </div>

            {/* Contest Details */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Contest Details
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-800/50 rounded p-4 text-center">
                  <div className="text-sm text-zinc-400 mb-1">Duration</div>
                  <div className="text-2xl font-bold">{contest.duration} min</div>
                </div>
                <div className="bg-zinc-800/50 rounded p-4 text-center">
                  <div className="text-sm text-zinc-400 mb-1">Problems</div>
                  <div className="text-2xl font-bold">{contest.problemCount}</div>
                </div>
                <div className="bg-zinc-800/50 rounded p-4 text-center">
                  <div className="text-sm text-zinc-400 mb-1">Participants</div>
                  <div className="text-2xl font-bold">{contest.participantCount}</div>
                </div>
              </div>

              {contest.description && (
                <div className="mb-4">
                  <p className="text-zinc-300">{contest.description}</p>
                </div>
              )}
            </div>

            {/* Rules */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Rules</h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                {contest.rules?.map((rule, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-blue-400 font-bold">{idx + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Action & Participants */}
          <div className="space-y-6">
            {/* Action Button */}
            {hasJoined ? (
              <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-6 text-center">
                <div className="text-sm text-green-400 mb-2">✓ You have joined this contest</div>
                <button
                  onClick={handleStartContest}
                  className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold transition-colors mt-4"
                >
                  Enter Contest
                </button>
              </div>
            ) : (
              <button
                onClick={() => setHasJoined(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Join Contest
              </button>
            )}

            {/* Participants */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recent Participants ({participants.length})
              </h3>
              <ParticipantList participants={participants} />
            </div>

            {/* Frame VR */}
            <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">🎮 Study Together</h4>
              <p className="text-sm text-zinc-300 mb-3">Open the embedded Frame VR room inside CP Arena.</p>
              <Link
                href="/arena/vr"
                className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold text-center block transition-colors"
              >
                Open VR Room
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
