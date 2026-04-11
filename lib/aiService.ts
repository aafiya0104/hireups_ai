const fallbackMessage =
  "Hello, we would like to connect with you for placement opportunities.";

function buildPrompt(recipient: string, company: string) {
  return `Write a concise professional outreach message to ${recipient} from a training and placement office. Mention ${company} and ask to connect for placement opportunities. Keep it under 60 words.`;
}

export async function generateOutreachMessage(recipient: string, company: string) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return fallbackMessage;
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
        messages: [
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
        temperature: 0.5,
        max_tokens: 120,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackMessage;
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content?.trim();

    return content || fallbackMessage;
  } catch (error) {
    console.error("Groq generation failed, using fallback message.", error);
    return fallbackMessage;
  }
}
