// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Bot, Grip, MessageCircle, Send, Sparkles, X } from "lucide-react";

// type WidgetMessage = {
//   role: "user" | "assistant";
//   content: string;
// };

// type FaqItem = {
//   question: string;
//   answer: string;
// };

// const defaultAssistantGreeting =
//   "Hi, I am the HireUps assistant. Ask me about TPO features, setup, APIs, analytics, outreach, or student workflows.";

// const defaultFaqs: FaqItem[] = [
//   { question: "What can I do on the TPO dashboard?", answer: "" },
//   { question: "How are company scores calculated?", answer: "" },
//   { question: "How does the outreach system work?", answer: "" },
//   { question: "Which TPO pages are available?", answer: "" },
// ];

// export function ChatbotWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [messages, setMessages] = useState<WidgetMessage[]>([
//     { role: "assistant", content: defaultAssistantGreeting },
//   ]);
//   const [faqs, setFaqs] = useState<FaqItem[]>([]);
//   const [source, setSource] = useState<"groq" | "fallback">("fallback");
//   const [position, setPosition] = useState({ x: 24, y: 24 });
//   const [dragging, setDragging] = useState(false);
//   const dragOffset = useRef({ x: 0, y: 0 });
//   const widgetRef = useRef<HTMLDivElement | null>(null);
//   const initialized = useRef(false);

//   useEffect(() => {
//     if (initialized.current) {
//       return;
//     }

//     initialized.current = true;
//     const width = window.innerWidth;
//     const height = window.innerHeight;
//     setPosition({
//       x: Math.max(16, width - 404),
//       y: Math.max(16, height - 116),
//     });
//   }, []);

//   useEffect(() => {
//     if (!dragging) {
//       return;
//     }

//     const onMove = (event: PointerEvent) => {
//       const cardWidth = widgetRef.current?.offsetWidth ?? 380;
//       const cardHeight = isOpen ? widgetRef.current?.offsetHeight ?? 520 : 72;
//       const nextX = Math.min(
//         Math.max(8, event.clientX - dragOffset.current.x),
//         window.innerWidth - cardWidth - 8,
//       );
//       const nextY = Math.min(
//         Math.max(8, event.clientY - dragOffset.current.y),
//         window.innerHeight - cardHeight - 8,
//       );
//       setPosition({ x: nextX, y: nextY });
//     };

//     const onUp = () => setDragging(false);

//     window.addEventListener("pointermove", onMove);
//     window.addEventListener("pointerup", onUp);

//     return () => {
//       window.removeEventListener("pointermove", onMove);
//       window.removeEventListener("pointerup", onUp);
//     };
//   }, [dragging, isOpen]);

//   const sendMessage = async (messageText: string) => {
//     const trimmed = messageText.trim();
//     if (!trimmed) {
//       return;
//     }

//     const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
//     setMessages(nextMessages);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch("/api/chatbot", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           message: trimmed,
//           history: nextMessages.slice(-6),
//         }),
//       });
//       const payload = (await response.json()) as {
//         data?: {
//           answer?: string;
//           source?: "groq" | "fallback";
//           faqs?: FaqItem[];
//         };
//       };
//       const answer =
//         payload.data?.answer ||
//         "I am in fallback mode right now, but I can still help with HireUps product questions.";
//       setMessages((current) => [...current, { role: "assistant", content: answer }]);
//       setSource(payload.data?.source ?? "fallback");
//       setFaqs(payload.data?.faqs ?? []);
//     } catch (error) {
//       console.error("Chat widget request failed.", error);
//       setMessages((current) => [
//         ...current,
//         {
//           role: "assistant",
//           content:
//             "The HireUps assistant could not reach the AI service, so I am answering in fallback mode.",
//         },
//       ]);
//       setSource("fallback");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
//     const rect = widgetRef.current?.getBoundingClientRect();
//     if (!rect) {
//       return;
//     }
//     dragOffset.current = {
//       x: event.clientX - rect.left,
//       y: event.clientY - rect.top,
//     };
//     setDragging(true);
//   };

//   return (
//     <div
//       ref={widgetRef}
//       className="fixed z-[70] w-[min(380px,calc(100vw-16px))] touch-none select-none"
//       style={{ left: position.x, top: position.y }}
//     >
//       <div className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#090911]/95 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
//         <div
//           onPointerDown={handlePointerDown}
//           className="flex cursor-grab items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#6666ff]/25 via-[#b8baff]/15 to-[#b9f0d7]/15 px-4 py-3 active:cursor-grabbing"
//         >
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
//               <Bot className="h-5 w-5 text-[#c9e8ff]" />
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-white">HireUps Assistant</p>
//               <p className="text-xs text-zinc-300">
//                 {source === "groq" ? "Groq AI live" : "Fallback knowledge mode"}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Grip className="h-4 w-4 text-zinc-300" />
//             <button
//               onClick={() => setIsOpen((current) => !current)}
//               className="rounded-full border border-white/10 p-2 text-zinc-100 transition hover:bg-white/10"
//               aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
//             >
//               {isOpen ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
//             </button>
//           </div>
//         </div>

//         {isOpen ? (
//           <div className="flex h-[520px] flex-col">
//             <div className="border-b border-white/10 px-4 py-3 text-xs text-zinc-400">
//               Drag this widget anywhere on the page. Use the FAQ chips or ask your own question.
//             </div>

//             <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
//               {messages.map((message, index) => (
//                 <div
//                   key={`${message.role}-${index}`}
//                   className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
//                     message.role === "assistant"
//                       ? "bg-white/7 text-zinc-100"
//                       : "ml-auto bg-[#6666ff] text-white"
//                   }`}
//                 >
//                   {message.content}
//                 </div>
//               ))}
//               {loading ? (
//                 <div className="max-w-[88%] rounded-2xl bg-white/7 px-4 py-3 text-sm text-zinc-300">
//                   Thinking...
//                 </div>
//               ) : null}
//             </div>

//             <div className="border-t border-white/10 px-4 py-3">
//               <div className="mb-3 flex flex-wrap gap-2">
//                 {(faqs.length > 0 ? faqs : defaultFaqs)
//                   .slice(0, 4)
//                   .map((faq) => (
//                     <button
//                       key={faq.question}
//                       onClick={() => void sendMessage(faq.question)}
//                       className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-left text-xs text-zinc-200 transition hover:bg-white/10"
//                     >
//                       <span className="inline-flex items-center gap-1">
//                         <Sparkles className="h-3.5 w-3.5 text-[#b9f0d7]" />
//                         {faq.question}
//                       </span>
//                     </button>
//                   ))}
//               </div>

//               <form
//                 onSubmit={(event) => {
//                   event.preventDefault();
//                   void sendMessage(input);
//                 }}
//                 className="flex items-end gap-2"
//               >
//                 <textarea
//                   value={input}
//                   onChange={(event) => setInput(event.target.value)}
//                   placeholder="Ask about HireUps, TPO tools, APIs, setup..."
//                   rows={2}
//                   className="min-h-[56px] flex-1 resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
//                 />
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6666ff] text-white transition hover:bg-[#7d7dff] disabled:opacity-60"
//                   aria-label="Send message"
//                 >
//                   <Send className="h-4 w-4" />
//                 </button>
//               </form>
//             </div>
//           </div>
//         ) : (
//           <button
//             onClick={() => setIsOpen(true)}
//             className="flex w-full items-center justify-between px-4 py-4 text-left"
//           >
//             <div>
//               <p className="text-sm font-semibold text-white">Ask HireUps AI</p>
//               <p className="text-xs text-zinc-400">
//                 Product help, FAQs, setup, TPO tools, analytics
//               </p>
//             </div>
//             <MessageCircle className="h-5 w-5 text-[#b9f0d7]" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";

type WidgetMessage = {
  role: "user" | "assistant";
  content: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const defaultAssistantGreeting =
  "Hi, I am the HireUps assistant. Ask me about TPO features, setup, APIs, analytics, outreach, or student workflows.";

const defaultFaqs: FaqItem[] = [
  { question: "What can I do on the TPO dashboard?", answer: "" },
  { question: "How are company scores calculated?", answer: "" },
  { question: "How does the outreach system work?", answer: "" },
  { question: "Which TPO pages are available?", answer: "" },
];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<WidgetMessage[]>([
    { role: "assistant", content: defaultAssistantGreeting },
  ]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [source, setSource] = useState<"groq" | "fallback">("fallback");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages.slice(-6),
        }),
      });
      const payload = (await response.json()) as {
        data?: {
          answer?: string;
          source?: "groq" | "fallback";
          faqs?: FaqItem[];
        };
      };
      const answer =
        payload.data?.answer ||
        "I am in fallback mode right now, but I can still help with HireUps product questions.";
      setMessages((current) => [...current, { role: "assistant", content: answer }]);
      setSource(payload.data?.source ?? "fallback");
      setFaqs(payload.data?.faqs ?? []);
    } catch (error) {
      console.error("Chat widget request failed.", error);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "The HireUps assistant could not reach the AI service, so I am answering in fallback mode.",
        },
      ]);
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Fixed Chatbot Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-[1.75rem] bg-gradient-to-r from-[#6666ff]/25 hover:from-[#6666ff]/40 p-0 shadow-lg transition-all duration-200 hover:scale-105"
        aria-label="Open HireUps AI Chatbot"
      >
        <Bot className="h-6 w-6 text-[#c9e8ff]" />
      </button>

      {/* Chatbot Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#090911]/95 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#6666ff]/25 via-[#b8baff]/15 to-[#b9f0d7]/15 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                  <Bot className="h-5 w-5 text-[#c9e8ff]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">HireUps Assistant</p>
                  <p className="text-xs text-zinc-300">
                    {source === "groq" ? "Groq AI live" : "Fallback knowledge mode"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/10 p-2 text-zinc-100 transition hover:bg-white/10"
                aria-label="Close chatbot"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex h-[400px] flex-col">
              <div className="border-b border-white/10 px-4 py-3 text-xs text-zinc-400">
                Use the FAQ chips or ask your own question.
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" ref={messagesEndRef}>
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "assistant"
                        ? "bg-white/7 text-zinc-100"
                        : "ml-auto bg-[#6666ff] text-white"
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {loading ? (
                  <div className="max-w-[88%] rounded-2xl bg-white/7 px-4 py-3 text-sm text-zinc-300">
                    Thinking...
                  </div>
                ) : null}
              </div>

              {/* Input */}
              <div className="border-t border-white/10 px-4 py-3">
                <div className="mb-3 flex flex-wrap gap-2">
                  {(faqs.length > 0 ? faqs : defaultFaqs)
                    .slice(0, 4)
                    .map((faq) => (
                      <button
                        key={faq.question}
                        onClick={() => void sendMessage(faq.question)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-left text-xs text-zinc-200 transition hover:bg-white/10"
                      >
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-[#b9f0d7]" />
                          {faq.question}
                        </span>
                      </button>
                    ))}
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void sendMessage(input);
                  }}
                  className="flex items-end gap-2"
                >
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                    placeholder="Ask about HireUps, TPO tools, APIs, setup..."
                    rows={2}
                    className="min-h-[56px] flex-1 resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6666ff] text-white transition hover:bg-[#7d7dff] disabled:opacity-60"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
