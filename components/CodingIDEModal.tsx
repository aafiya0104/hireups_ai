"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { X, Play, CheckCircle2, Code2, Terminal, ChevronDown, Zap } from "lucide-react";
import toast from "react-hot-toast";

// Monaco must be loaded client-side only (no SSR)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Language = "cpp" | "java" | "python";
type Difficulty = "Easy" | "Medium" | "Hard";

interface Problem {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  solved: boolean;
}

interface CodingIDEModalProps {
  problem: Problem | null;
  topicName: string;
  onClose: () => void;
  onSolve: (problemId: string) => void;
}

const LANGUAGE_META: Record<Language, { label: string; monacoLang: string; color: string }> = {
  cpp: { label: "C++", monacoLang: "cpp", color: "text-blue-400 border-blue-500/40 bg-blue-500/10" },
  java: { label: "Java", monacoLang: "java", color: "text-orange-400 border-orange-500/40 bg-orange-500/10" },
  python: { label: "Python", monacoLang: "python", color: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10" },
};

const STARTER_CODE: Record<Language, (problemId: string) => string> = {
  cpp: (id) => `#include <bits/stdc++.h>
using namespace std;

// Problem: Algorithm Challenge ${id.replace("p", "")}
// Write your solution below

class Solution {
public:
    // TODO: Implement your solution
    vector<int> solve(vector<int>& nums) {
        
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {1, 2, 3, 4, 5};
    auto result = sol.solve(nums);
    return 0;
}`,
  java: (id) => `import java.util.*;

// Problem: Algorithm Challenge ${id.replace("p", "")}
// Write your solution below

class Solution {
    // TODO: Implement your solution
    public int[] solve(int[] nums) {
        
        return new int[]{};
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] nums = {1, 2, 3, 4, 5};
        int[] result = sol.solve(nums);
        System.out.println(Arrays.toString(result));
    }
}`,
  python: (id) => `# Problem: Algorithm Challenge ${id.replace("p", "")}
# Write your solution below

from typing import List

class Solution:
    def solve(self, nums: List[int]) -> List[int]:
        # TODO: Implement your solution
        
        return []


if __name__ == "__main__":
    sol = Solution()
    nums = [1, 2, 3, 4, 5]
    result = sol.solve(nums)
    print(result)`,
};

const OUTPUT_TEMPLATE = (lang: Language, passed: boolean) =>
  passed
    ? `✓ Running ${LANGUAGE_META[lang].label} solution...\n\n[Compiling...]\n[Linked OK]\n\n> Test Case 1: [1,2,3] → PASSED ✅\n> Test Case 2: [0,-1,5,3] → PASSED ✅\n> Test Case 3: [] → PASSED ✅\n\nAll 3 test cases passed!\nRuntime: ${Math.floor(Math.random() * 60 + 4)}ms | Memory: ${Math.floor(Math.random() * 40 + 10)}MB`
    : `✗ Running ${LANGUAGE_META[lang].label} solution...\n\n[Compiling...]\n\n> Test Case 1: [1,2,3] → FAILED ❌\nExpected: [1,3] | Got: []\n\nHint: Check your loop boundary conditions.`;

export default function CodingIDEModal({ problem, topicName, onClose, onSolve }: CodingIDEModalProps) {
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState<Record<Language, string>>({
    cpp: problem ? STARTER_CODE.cpp(problem.id) : "",
    java: problem ? STARTER_CODE.java(problem.id) : "",
    python: problem ? STARTER_CODE.python(problem.id) : "",
  });
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleLanguageSwitch = useCallback((lang: Language) => {
    setLanguage(lang);
    setOutput(null);
    setPassed(false);
  }, []);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setShowOutput(true);
    setOutput("⏳ Executing...");
    await new Promise((r) => setTimeout(r, 1500));
    const result = Math.random() > 0.35; // 65% chance pass on run
    const out = OUTPUT_TEMPLATE(language, result);
    setOutput(out);
    setPassed(result);
    setIsRunning(false);
    if (result) toast.success("✅ Test Cases Passed! Submit to complete.");
    else toast.error("❌ Some tests failed. Try again!");
  }, [language]);

  const handleSubmit = useCallback(() => {
    if (!passed) {
      toast.error("Run your code first and make sure tests pass!");
      return;
    }
    if (problem) {
      onSolve(problem.id);
      toast.success("🎉 Problem Solved! +XP Earned!");
      onClose();
    }
  }, [passed, problem, onSolve, onClose]);

  if (!problem) return null;

  const difficultyColors: Record<Difficulty, string> = {
    Easy: "text-green-400 bg-green-500/10 border border-green-500/30",
    Medium: "text-orange-400 bg-orange-500/10 border border-orange-500/30",
    Hard: "text-red-400 bg-red-500/10 border border-red-500/30",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.93, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.93, y: 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="w-full max-w-5xl bg-[#0a0a14] border border-white/8 rounded-3xl shadow-[0_0_80px_rgba(102,102,255,0.15)] flex flex-col overflow-hidden"
          style={{ height: "88vh", maxHeight: "820px" }}
        >
          {/* ─── Header ─── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-black/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#6666ff]/20 text-[#6666ff]">
                <Code2 size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-sans uppercase tracking-wider">{topicName}</p>
                <h3 className="text-white font-heading font-bold text-base leading-tight">
                  Algorithm Challenge {problem.id.replace("p", "")}
                </h3>
              </div>
              <span className={`ml-2 text-xs font-bold px-2.5 py-1 rounded-full font-sans ${difficultyColors[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
            </div>

            {/* Language Tabs */}
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/8">
              {(Object.keys(LANGUAGE_META) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSwitch(lang)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold font-sans transition-all duration-200 ${
                    language === lang
                      ? `${LANGUAGE_META[lang].color} border`
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {LANGUAGE_META[lang].label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold font-sans text-sm bg-[#6666ff]/20 text-[#6666ff] border border-[#6666ff]/30 hover:bg-[#6666ff]/30 transition-colors disabled:opacity-50"
              >
                <Play size={14} className={isRunning ? "animate-spin" : ""} />
                {isRunning ? "Running..." : "Run Code"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSubmit}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold font-sans text-sm transition-all ${
                  passed
                    ? "bg-gradient-to-r from-[#6666ff] to-[#b9f0d7] text-black shadow-[0_0_20px_rgba(102,102,255,0.4)]"
                    : "bg-white/5 text-gray-400 border border-white/10 cursor-not-allowed"
                }`}
              >
                <CheckCircle2 size={14} />
                Submit
              </motion.button>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* ─── Main: Editor + Problem Desc ─── */}
          <div className="flex flex-1 overflow-hidden">
            {/* Problem Description Panel */}
            <div className="w-72 shrink-0 border-r border-white/8 overflow-y-auto custom-scrollbar p-5 bg-black/20">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-[#6666ff]" />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider font-sans">Problem</span>
              </div>
              <h4 className="text-white font-heading font-bold text-sm mb-3">
                Algorithm Challenge {problem.id.replace("p", "")}
              </h4>
              <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4">
                Given an array of integers, implement an efficient algorithm to solve this challenge.
                Your solution must handle edge cases including empty arrays and negative numbers.
              </p>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-sans">Example Input</p>
                  <code className="text-xs text-[#b9f0d7] font-mono">nums = [1, 2, 3, 4, 5]</code>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-sans">Expected Output</p>
                  <code className="text-xs text-[#6666ff] font-mono">result = [1, 3]</code>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-sans">Constraints</p>
                  <ul className="text-xs text-gray-400 font-sans space-y-1">
                    <li>• 1 ≤ nums.length ≤ 10⁵</li>
                    <li>• -10⁴ ≤ nums[i] ≤ 10⁴</li>
                    <li>• Time: O(n log n)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/8">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-sans">Hints</p>
                <div className="space-y-2">
                  {["Think about using a hash map", "Consider two-pass approach", "Edge case: duplicates"].map((hint, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-400 font-sans">
                      <span className="w-4 h-4 rounded-full bg-[#6666ff]/20 text-[#6666ff] flex items-center justify-center shrink-0 text-[10px]">{i + 1}</span>
                      {hint}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0">
                <MonacoEditor
                  height="100%"
                  language={LANGUAGE_META[language].monacoLang}
                  value={code[language]}
                  onChange={(val) => setCode((prev) => ({ ...prev, [language]: val ?? "" }))}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontLigatures: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: "on",
                    roundedSelection: true,
                    cursorStyle: "line",
                    padding: { top: 16, bottom: 16 },
                    smoothScrolling: true,
                    wordWrap: "on",
                  }}
                />
              </div>

              {/* Output Panel */}
              <AnimatePresence>
                {showOutput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "180px", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="shrink-0 border-t border-white/8 bg-[#050510] flex flex-col overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Terminal size={12} className="text-gray-500" />
                        <span className="text-xs text-gray-400 font-sans font-bold uppercase tracking-wider">Output</span>
                        {!isRunning && (
                          <span className={`text-xs font-bold font-sans px-2 py-0.5 rounded-full ${passed ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>
                            {passed ? "All Passed" : "Failed"}
                          </span>
                        )}
                      </div>
                      <button onClick={() => setShowOutput(false)} className="text-gray-600 hover:text-gray-400">
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <pre className="flex-1 overflow-auto p-4 text-xs font-mono text-gray-300 leading-relaxed custom-scrollbar">
                      {output}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
