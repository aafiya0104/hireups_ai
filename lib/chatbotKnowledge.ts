export const chatbotFaqs = [
  {
    question: "What can I do on the TPO dashboard?",
    answer:
      "The TPO dashboard gives you recruiter discovery, alumni radar, outreach workflows, placement analytics, drive comparison, CSV export, and admin actions for companies, alumni, and outreach approvals.",
  },
  {
    question: "How are company scores calculated?",
    answer:
      "Company scores are calculated using hiring frequency, role match, average salary, and tier match. The weighted formula emphasizes hiring frequency and role fit the most.",
  },
  {
    question: "How does the outreach system work?",
    answer:
      "The outreach module generates a message with Groq when a key is available, stores the outreach log, assigns a delivery status, and lets admins approve entries from the dashboard.",
  },
  {
    question: "Which TPO pages are available?",
    answer:
      "The TPO pages are /tpo/dashboard, /tpo/companies, /tpo/alumni, /tpo/outreach, /tpo/analytics, and /tpo/drives.",
  },
  {
    question: "Which API routes power the TPO module?",
    answer:
      "The main API routes are /api/tpo/companies, /api/tpo/alumni, /api/tpo/outreach, /api/tpo/outreach/send, /api/tpo/stats, /api/tpo/drives, and /api/chatbot.",
  },
  {
    question: "Does HireUps still work without MongoDB or Groq?",
    answer:
      "Yes. HireUps is built with fallback behavior. If MongoDB or Groq is unavailable, the app still serves built-in data and fallback assistant or outreach responses.",
  },
  {
    question: "How do I add API keys to HireUps?",
    answer:
      "Create a .env.local file in the project root and add MONGODB_URI, MONGODB_DB, GROQ_API_KEY, and GROQ_MODEL. Restart the dev server after updating those values.",
  },
];

export const chatbotSystemContext = `
You are the HireUps in-app assistant.

About HireUps:
- HireUps is an AI-powered placement operating system for engineering colleges and placement teams.
- It serves students, TPOs, recruiters, and alumni.
- The current product includes a TPO dashboard built with Next.js App Router, API route handlers, MongoDB-ready Mongoose models, and safe fallback datasets.

Key TPO routes:
- /tpo/dashboard
- /tpo/companies
- /tpo/alumni
- /tpo/outreach
- /tpo/analytics
- /tpo/drives

Current TPO capabilities:
- Recruiter discovery with company scoring and filters.
- Alumni radar with company, role, and name-based search.
- Outreach generation with Groq AI or a static fallback message.
- Placement analytics with KPI cards and chart-ready data.
- Previous drives comparison with CSV export.
- Admin actions to add and edit companies, add alumni, and approve outreach logs.

Important APIs:
- /api/tpo/companies
- /api/tpo/alumni
- /api/tpo/outreach
- /api/tpo/outreach/send
- /api/tpo/stats
- /api/tpo/drives
- /api/chatbot

Operational behavior:
- The app is designed not to crash when external services are unavailable.
- MongoDB is optional for local demos because fallback data is built in.
- Groq is optional. If unavailable, the app returns a simple static response.

Guidelines:
- Answer only using this product context and the user's question.
- Be concise, helpful, and product-aware.
- Prefer product-specific answers over generic AI assistant wording.
- When relevant, mention the exact page or API route involved.
- If the user asks something outside HireUps context, say that you can help with HireUps platform usage, TPO workflows, pages, APIs, setup, and features.
- Do not invent unavailable features.
`.trim();

const fallbackRules = [
  {
    keywords: ["tpo", "dashboard", "analytics", "drives"],
    answer:
      "The TPO dashboard includes recruiter discovery, alumni radar, outreach workflows, analytics, and historical drive comparison.",
  },
  {
    keywords: ["api", "endpoint", "route"],
    answer:
      "The platform includes API routes for companies, alumni, outreach, stats, and drives. They are implemented under /app/api/tpo.",
  },
  {
    keywords: ["groq", "ai", "chatbot", "message"],
    answer:
      "Groq is used as an optional AI layer. If a Groq key is available, HireUps can generate outreach and chatbot responses. Otherwise it falls back safely.",
  },
  {
    keywords: ["mongodb", "database", "db", "mongoose"],
    answer:
      "HireUps is MongoDB-ready through Mongoose models, but the TPO module also works with built-in fallback data for local demos.",
  },
  {
    keywords: ["student", "roadmap", "preparation"],
    answer:
      "HireUps also supports student workflows such as preparation and roadmap experiences alongside TPO tools.",
  },
];

export function getFallbackChatAnswer(message: string) {
  const normalized = message.toLowerCase();

  const faqMatch = chatbotFaqs.find((faq) =>
    normalized.includes(faq.question.toLowerCase().replace(/[?]/g, "")),
  );

  if (faqMatch) {
    return faqMatch.answer;
  }

  const matchedRule = fallbackRules.find((rule) =>
    rule.keywords.some((keyword) => normalized.includes(keyword)),
  );

  if (matchedRule) {
    return matchedRule.answer;
  }

  return "I can help with HireUps features, TPO workflows, setup, APIs, dashboard pages, and how the platform behaves when Groq or MongoDB is unavailable.";
}
