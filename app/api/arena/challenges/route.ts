import { NextRequest, NextResponse } from 'next/server';

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

const getStore = () => {
  const g = globalThis as unknown as { __arenaChallenges?: Challenge[] };
  if (!g.__arenaChallenges) {
    g.__arenaChallenges = [
      {
        id: 'ch-1',
        challenger: 'You',
        opponent: 'Priya Sharma',
        problemTitle: 'Two Sum Variant',
        language: 'cpp',
        duration: 20,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return g.__arenaChallenges;
};

export async function GET() {
  return NextResponse.json({ challenges: getStore() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challenger, opponent, problemTitle, language, duration } = body;

    if (!challenger || !opponent || !problemTitle || !language || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const challenge: Challenge = {
      id: `ch-${Date.now()}`,
      challenger,
      opponent,
      problemTitle,
      language,
      duration: Number(duration),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const store = getStore();
    store.unshift(challenge);

    return NextResponse.json({ challenge }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body as { id: string; status: ChallengeStatus };

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const store = getStore();
    const idx = store.findIndex((c) => c.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    store[idx] = { ...store[idx], status };

    return NextResponse.json({ challenge: store[idx] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 });
  }
}
