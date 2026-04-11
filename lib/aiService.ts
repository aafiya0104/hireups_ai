const fallbackMessage =
  "Hello, we would like to connect with you for placement opportunities.";

type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const recruiterFallbackInvite =
  "Hello, your profile matches our current role requirements. We would like to invite you for an interview discussion. Please let us know your availability this week.";

const knownSkills = [
  "java",
  "javascript",
  "typescript",
  "python",
  "c++",
  "c",
  "react",
  "next.js",
  "node.js",
  "mongodb",
  "sql",
  "mysql",
  "postgresql",
  "aws",
  "docker",
  "kubernetes",
  "redis",
  "spring boot",
  "go",
  "machine learning",
  "nlp",
  "pandas",
  "power bi",
  "tailwind css",
  "fastapi",
];

function buildPrompt(recipient: string, company: string) {
  return `Write a concise professional outreach message to ${recipient} from a training and placement office. Mention ${company} and ask to connect for placement opportunities. Keep it under 60 words.`;
}

async function callGroq(messages: GroqMessage[], maxTokens = 300) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",
        messages,
        temperature: 0.3,
        max_tokens: maxTokens,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return payload.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (error) {
    console.error("Groq request failed, using fallback response.", error);
    return null;
  }
}

function extractJsonBlock(text: string) {
  const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return match?.[0] ?? null;
}

function normalizeSkill(raw: string) {
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

export function inferSkillsFromText(text: string) {
  const lower = text.toLowerCase();
  const found = knownSkills.filter((skill) => lower.includes(skill)).map(normalizeSkill);
  return Array.from(new Set(found));
}

export async function analyzeJobDescription(jobDescription: string) {
  const fallbackSkills = inferSkillsFromText(jobDescription).slice(0, 8);
  const fallbackExperience = /senior|lead|5\+|6\+|7\+/.test(jobDescription.toLowerCase())
    ? "senior"
    : /intern|fresher|entry|0-2|1-2/.test(jobDescription.toLowerCase())
      ? "entry"
      : "mid";

  const content = await callGroq(
    [
      {
        role: "system",
        content:
          "You extract structured recruiter signals from job descriptions. Reply with valid JSON only.",
      },
      {
        role: "user",
        content: `Analyze this JD and return JSON with keys requiredSkills (array), experienceLevel (string), hiringSignals (array).\n\n${jobDescription}`,
      },
    ],
    220,
  );

  if (!content) {
    return {
      requiredSkills: fallbackSkills,
      experienceLevel: fallbackExperience,
      hiringSignals: [
        "Fallback JD parsing was used.",
        "Candidate ranking will prefer skill overlap, DSA, portfolio, and CGPA.",
      ],
      aiUsed: false,
    };
  }

  try {
    const parsed = JSON.parse(extractJsonBlock(content) ?? "{}") as {
      requiredSkills?: string[];
      experienceLevel?: string;
      hiringSignals?: string[];
    };

    return {
      requiredSkills: (parsed.requiredSkills ?? fallbackSkills).map(normalizeSkill).slice(0, 8),
      experienceLevel: parsed.experienceLevel?.trim() || fallbackExperience,
      hiringSignals:
        parsed.hiringSignals?.filter(Boolean).slice(0, 4) ?? [
          "Groq analysis completed successfully.",
        ],
      aiUsed: true,
    };
  } catch {
    return {
      requiredSkills: fallbackSkills,
      experienceLevel: fallbackExperience,
      hiringSignals: ["Groq returned invalid JSON. Fallback parsing was used instead."],
      aiUsed: false,
    };
  }
}

export async function rankCandidatesWithGroq(
  jobDescription: string,
  candidates: Array<{ id: string; name: string; branch: string; skills: string[]; cgpa: number }>,
) {
  const content = await callGroq(
    [
      {
        role: "system",
        content:
          "You rank candidates for recruiters. Reply with valid JSON only using keys rankedIds and reasons.",
      },
      {
        role: "user",
        content: `Job description:\n${jobDescription}\n\nCandidates:\n${JSON.stringify(
          candidates,
        )}\n\nReturn JSON like {"rankedIds":["id1"],"reasons":{"id1":"why"}}`,
      },
    ],
    420,
  );

  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(extractJsonBlock(content) ?? "{}") as {
      rankedIds?: string[];
      reasons?: Record<string, string>;
    };
    return {
      rankedIds: parsed.rankedIds ?? [],
      reasons: parsed.reasons ?? {},
    };
  } catch {
    return null;
  }
}

export async function generateRecruiterMessage(candidateName: string, company: string, role: string) {
  const content = await callGroq(
    [
      {
        role: "system",
        content:
          "You write concise, professional recruiter outreach. Reply with only the message body.",
      },
      {
        role: "user",
        content: `Write a professional recruiter message inviting ${candidateName} for an interview at ${company} for the role ${role}. Keep it under 80 words.`,
      },
    ],
    140,
  );

  return content || recruiterFallbackInvite;
}

export async function generateOutreachMessage(recipient: string, company: string) {
  const content = await callGroq(
    [
      {
        role: "system",
        content:
          "You generate short professional placement outreach messages. Reply with only the message body.",
      },
      {
        role: "user",
        content: buildPrompt(recipient, company),
      },
    ],
    120,
  );

  return content || fallbackMessage;
}
