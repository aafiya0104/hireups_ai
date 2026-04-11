'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Send, Zap, Eye, EyeOff, ChevronDown } from 'lucide-react';
import CodeEditor from '../../../components/CodeEditor';
import ProblemPanel from '../../../components/ProblemPanel';
import ContestTimer from '../../../components/ContestTimer';
import LiveLeaderboard from '../../../components/LiveLeaderboard';

interface Problem {
  _id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  description: string;
  inputFormat: string;
  outputFormat: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
}

export default function ContestInterfacePage() {
  const params = useParams();
  const router = useRouter();
  const contestID = params.contestId as string;
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'cpp' | 'java' | 'python'>('cpp');
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(120 * 60); // 2 hours in seconds

  useEffect(() => {
    // Mock problem data
    const mockProblems: Problem[] = [
      {
        _id: 'problem-1',
        title: 'Two Sum',
        difficulty: 'easy',
        points: 100,
        description:
          'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice.',
        inputFormat: 'First line: integers n (length of array) and target\nSecond line: n space-separated integers',
        outputFormat: 'Two space-separated integers representing the indices',
        examples: [
          {
            input: '2\n3 3 4\n6',
            output: '0 1',
            explanation: 'The sum of 3 and 3 is 6. The indices are 0 and 1.',
          },
        ],
      },
      {
        _id: 'problem-2',
        title: 'Median of Two Sorted Arrays',
        difficulty: 'hard',
        points: 300,
        description:
          'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
        inputFormat: 'Two lines with sorted arrays',
        outputFormat: 'A single float representing the median',
        examples: [],
      },
      {
        _id: 'problem-3',
        title: 'Longest Substring',
        difficulty: 'medium',
        points: 200,
        description: 'Find the length of the longest substring without repeating characters.',
        inputFormat: 'A single string',
        outputFormat: 'An integer representing the length',
        examples: [],
      },
      {
        _id: 'problem-4',
        title: 'Container With Most Water',
        difficulty: 'medium',
        points: 200,
        description: 'You are given an integer array height of length n. Given two lines on a chart where the ith and jth lines represent height[i] and height[j].',
        inputFormat: 'An array of integers',
        outputFormat: 'Maximum area that can be contained',
        examples: [],
      },
    ];

    setProblems(mockProblems);
    setSelectedProblem(mockProblems[0]);
  }, []);

  const handleSubmit = async () => {
    if (!selectedProblem || !code.trim()) {
      alert('Please write some code first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/arena/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contestID,
          problemID: selectedProblem._id,
          code,
          language,
        }),
      });

      const result = await response.json();
      setSubmission(result);
      setVerdict(result.verdict);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/arena')}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg">Weekly Contest #45</h1>
            <p className="text-sm text-zinc-400">
              Problem {problems.indexOf(selectedProblem || problems[0]) + 1} of {problems.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ContestTimer seconds={timeRemaining} />
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
          >
            {showLeaderboard ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showLeaderboard ? 'Hide' : 'Show'} Live Leaderboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problems Panel */}
        <div className="w-1/3 border-r border-zinc-800 overflow-y-auto">
          <div className="p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900/50 backdrop-blur">
            <h2 className="font-bold mb-3">Problems</h2>
            <div className="space-y-2">
              {problems.map((problem, idx) => (
                <button
                  key={problem._id}
                  onClick={() => setSelectedProblem(problem)}
                  className={`w-full text-left p-3 rounded transition-colors ${
                    selectedProblem?._id === problem._id
                      ? 'bg-blue-600/30 border border-blue-500/50 text-blue-300'
                      : 'bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="font-semibold text-sm">
                    {String.fromCharCode(65 + idx)}. {problem.title}
                  </div>
                  <div className="text-xs text-zinc-400 flex justify-between mt-1">
                    <span>{problem.points} points</span>
                    <span className={`px-2 py-0.5 rounded text-white ${
                      problem.difficulty === 'easy'
                        ? 'bg-green-600/50'
                        : problem.difficulty === 'medium'
                          ? 'bg-yellow-600/50'
                          : 'bg-red-600/50'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedProblem && (
            <div className="p-4">
              <ProblemPanel problem={selectedProblem} />
            </div>
          )}
        </div>

        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col border-r border-zinc-800" style={showLeaderboard ? {} : {}}>
          {/* Language Selector and Submit */}
          <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'cpp' | 'java' | 'python')}
              className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition-colors ${
                loading
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          {/* Editor */}
          <CodeEditor code={code} setCode={setCode} language={language} />

          {/* Verdict */}
          {submission && (
            <div className={`border-t border-zinc-800 p-4 ${
              verdict === 'accepted' ? 'bg-green-600/10 border-green-500/30' : 'bg-red-600/10 border-red-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-bold text-lg ${verdict === 'accepted' ? 'text-green-400' : 'text-red-400'}`}>
                    {verdict?.toUpperCase().replace('-', ' ')}
                  </div>
                  {submission.testCaseResults && (
                    <div className="text-sm text-zinc-400 mt-1">
                      Test cases: {submission.testCaseResults.filter((r: any) => r.verdict === 'accepted').length}/
                      {submission.testCaseResults.length}
                    </div>
                  )}
                </div>
                {submission.executionTime && (
                  <div className="text-right text-sm text-zinc-400">
                    <div>{submission.executionTime}ms</div>
                    <div>{submission.memory}MB</div>
                  </div>
                )}
              </div>

              {submission.aiFeedback && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="text-sm font-semibold text-purple-300 mb-2">AI Feedback</div>
                  <p className="text-sm text-zinc-300 mb-2">{submission.aiFeedback.summary}</p>
                  {Array.isArray(submission.aiFeedback.improvements) && submission.aiFeedback.improvements.length > 0 && (
                    <ul className="text-xs text-zinc-400 space-y-1">
                      {submission.aiFeedback.improvements.map((tip: string, index: number) => (
                        <li key={index}>- {tip}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Leaderboard */}
        {showLeaderboard && (
          <div className="w-80 border-l border-zinc-800 bg-zinc-900/50 overflow-y-auto">
            <LiveLeaderboard contestID={contestID} />
          </div>
        )}
      </div>
    </div>
  );
}
