import { NextRequest, NextResponse } from "next/server";

import {
  chatbotFaqs,
  chatbotSystemContext,
  getFallbackChatAnswer,
} from "@/lib/chatbotKnowledge";

export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      message?: string;
      history?: ChatMessage[];
    };

    const message = body.message?.trim() ?? "";
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

    if (!message) {
      return NextResponse.json({
        success: true,
        data: {
          answer: "Please ask a question about HireUps, TPO workflows, setup, or platform features.",
          source: "fallback",
          faqs: chatbotFaqs,
        },
      });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        data: {
          answer: getFallbackChatAnswer(message),
          source: "fallback",
          faqs: chatbotFaqs,
        },
      });
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
          temperature: 0.4,
          max_tokens: 220,
          messages: [
            {
              role: "system",
              content: chatbotSystemContext,
            },
            ...history.map((entry) => ({
              role: entry.role,
              content: entry.content,
            })),
            {
              role: "user",
              content: message,
            },
          ],
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Groq request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const answer = payload.choices?.[0]?.message?.content?.trim();

      return NextResponse.json({
        success: true,
        data: {
          answer: answer || getFallbackChatAnswer(message),
          source: answer ? "groq" : "fallback",
          faqs: chatbotFaqs,
        },
      });
    } catch (error) {
      console.error("Chatbot Groq request failed, using fallback.", error);
      return NextResponse.json({
        success: true,
        data: {
          answer: getFallbackChatAnswer(message),
          source: "fallback",
          faqs: chatbotFaqs,
        },
      });
    }
  } catch (error) {
    console.error("POST /api/chatbot failed.", error);
    return NextResponse.json({
      success: true,
      data: {
        answer:
          "The HireUps assistant is temporarily using fallback mode. Ask me about TPO pages, APIs, setup, or platform features.",
        source: "fallback",
        faqs: chatbotFaqs,
      },
    });
  }
}
