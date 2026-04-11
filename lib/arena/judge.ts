import type { Language, VerdictType } from '../types/arena';

interface JudgeOutput {
  verdict: VerdictType;
  executionTime: number;
  memory: number;
  testCaseResults: Array<{
    caseIndex: number;
    verdict: VerdictType;
    executionTime: number;
    memory: number;
  }>;
  timeComplexity: string;
  spaceComplexity: string;
  aiFeedback: {
    summary: string;
    improvements: string[];
    detectedSignals: string[];
  };
}

interface ProblemSignals {
  requiredAny: string[];
  requiredStrong: string[];
}

const languageSignals: Record<Language, ProblemSignals> = {
  cpp: {
    requiredAny: ['for', 'while', 'vector', 'unordered_map', 'map', 'sort', 'binary_search'],
    requiredStrong: ['int main', 'return 0'],
  },
  java: {
    requiredAny: ['for', 'while', 'HashMap', 'Map', 'Arrays.sort', 'Collections.sort'],
    requiredStrong: ['public class', 'main('],
  },
  python: {
    requiredAny: ['for ', 'while ', 'dict', 'set', 'sorted(', 'bisect'],
    requiredStrong: ['def ', 'if __name__'],
  },
};

function estimateComplexity(code: string): { time: string; space: string; signals: string[] } {
  const normalized = code.toLowerCase();
  const signals: string[] = [];

  const nestedLoopPatterns = ['for.*for', 'for.*while', 'while.*for', 'while.*while'];
  const hasNestedLoops = nestedLoopPatterns.some((p) => new RegExp(p, 's').test(normalized));
  const hasHashing = /hashmap|unordered_map|dict|set\(|map\s*</.test(normalized);
  const hasSorting = /sort\(|arrays\.sort|collections\.sort|sorted\(/.test(normalized);
  const hasBinarySearch = /binary_search|bisect|mid\s*=\s*\(.*\)\s*\/\s*2/.test(normalized);

  if (hasNestedLoops) {
    signals.push('nested-loops');
  }
  if (hasHashing) {
    signals.push('hashing');
  }
  if (hasSorting) {
    signals.push('sorting');
  }
  if (hasBinarySearch) {
    signals.push('binary-search');
  }

  let timeComplexity = 'O(n)';
  if (hasNestedLoops) {
    timeComplexity = 'O(n^2)';
  } else if (hasSorting) {
    timeComplexity = 'O(n log n)';
  } else if (hasBinarySearch) {
    timeComplexity = 'O(log n)';
  }

  let spaceComplexity = 'O(1)';
  if (hasHashing) {
    spaceComplexity = 'O(n)';
  }

  return { time: timeComplexity, space: spaceComplexity, signals };
}

function buildAIFeedback(verdict: VerdictType, time: string, space: string, signals: string[]) {
  const improvements: string[] = [];

  if (time === 'O(n^2)') {
    improvements.push('Try reducing nested loops with hashing or two-pointer techniques.');
  }
  if (!signals.includes('hashing')) {
    improvements.push('Consider using hash-based lookups to reduce repeated scans.');
  }
  if (!signals.includes('binary-search')) {
    improvements.push('Check whether binary search can be applied on sorted constraints.');
  }
  if (improvements.length === 0) {
    improvements.push('Great structure. Next step: add edge-case guards and stress test with large inputs.');
  }

  const summary =
    verdict === 'accepted'
      ? `Accepted. Detected ${time} time and ${space} space patterns.`
      : `Submission is ${verdict.replace(/-/g, ' ')}. Detected ${time} time and ${space} space patterns.`;

  return {
    summary,
    improvements,
    detectedSignals: signals,
  };
}

export function runHeuristicJudge(problemID: string, language: Language, code: string): JudgeOutput {
  const trimmed = code.trim();
  if (trimmed.length < 20) {
    return {
      verdict: 'compilation-error',
      executionTime: 0,
      memory: 0,
      testCaseResults: [{ caseIndex: 0, verdict: 'compilation-error', executionTime: 0, memory: 0 }],
      timeComplexity: 'Unknown',
      spaceComplexity: 'Unknown',
      aiFeedback: {
        summary: 'Compilation failed. The submission is too short to be a valid solution.',
        improvements: ['Complete your function and include required syntax for the selected language.'],
        detectedSignals: [],
      },
    };
  }

  const strongSignals = languageSignals[language].requiredStrong;
  const hasStrongSignal = strongSignals.some((s) => trimmed.includes(s));
  if (!hasStrongSignal) {
    return {
      verdict: 'compilation-error',
      executionTime: 0,
      memory: 0,
      testCaseResults: [{ caseIndex: 0, verdict: 'compilation-error', executionTime: 0, memory: 0 }],
      timeComplexity: 'Unknown',
      spaceComplexity: 'Unknown',
      aiFeedback: {
        summary: `Compilation failed. Missing required ${language.toUpperCase()} program structure.`,
        improvements: ['Use the provided code template and keep language-specific entry points.'],
        detectedSignals: [],
      },
    };
  }

  const requiredAny = languageSignals[language].requiredAny;
  const hitCount = requiredAny.filter((s) => trimmed.includes(s)).length;

  const complexity = estimateComplexity(trimmed);
  const totalCases = 5;
  const passRatioBase = Math.min(1, 0.3 + hitCount / (requiredAny.length + 1));
  const complexityPenalty = complexity.time === 'O(n^2)' && problemID === 'problem-2' ? 0.3 : 0;
  const passRatio = Math.max(0, passRatioBase - complexityPenalty);
  const passedCases = Math.max(0, Math.min(totalCases, Math.round(passRatio * totalCases)));

  let verdict: VerdictType = 'wrong-answer';
  if (passedCases === totalCases) {
    verdict = 'accepted';
  } else if (passedCases <= 1 && complexity.time === 'O(n^2)' && problemID === 'problem-2') {
    verdict = 'time-limit-exceeded';
  } else if (passedCases === 0) {
    verdict = 'runtime-error';
  }

  const executionTimeBase = complexity.time === 'O(n^2)' ? 1200 : complexity.time === 'O(n log n)' ? 620 : 280;
  const executionTime = executionTimeBase + (totalCases - passedCases) * 45;
  const memory = complexity.space === 'O(n)' ? 42 : 18;

  const testCaseResults = Array.from({ length: totalCases }, (_, idx) => {
    const ok = idx < passedCases;
    const failVerdict: VerdictType = verdict === 'time-limit-exceeded' ? 'time-limit-exceeded' : 'wrong-answer';
    return {
      caseIndex: idx,
      verdict: ok ? ('accepted' as VerdictType) : failVerdict,
      executionTime: ok ? Math.max(60, executionTime - idx * 30) : executionTime + idx * 25,
      memory,
    };
  });

  return {
    verdict,
    executionTime,
    memory,
    testCaseResults,
    timeComplexity: complexity.time,
    spaceComplexity: complexity.space,
    aiFeedback: buildAIFeedback(verdict, complexity.time, complexity.space, complexity.signals),
  };
}
