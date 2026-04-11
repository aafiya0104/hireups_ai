import { NextRequest, NextResponse } from 'next/server';
import { runHeuristicJudge } from '../../../../lib/arena/judge';

// POST /api/arena/submit - Submit code for verdict
export async function POST(request: NextRequest) {
  try {
    const { contestID, problemID, code, language } = await request.json();
    
    if (!contestID || !problemID || !code || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const judged = runHeuristicJudge(problemID, language, code);

    return NextResponse.json({
      _id: `submission-${Date.now()}`,
      contestID,
      problemID,
      verdict: judged.verdict,
      executionTime: judged.executionTime,
      memory: judged.memory,
      testCaseResults: judged.testCaseResults,
      timeComplexity: judged.timeComplexity,
      spaceComplexity: judged.spaceComplexity,
      aiFeedback: judged.aiFeedback,
      submittedAt: new Date(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
