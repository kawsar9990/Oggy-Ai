"use client";

import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Send } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "ai";
  text: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: data.reply ?? "Sorry, I couldn't process your request.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "ai",
          text: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div
      className={`flex h-[100dvh] flex-col transition-colors duration-200 ${
        isDarkMode
          ? "bg-[#0B1120] text-slate-100"
          : "bg-slate-50 text-slate-800"
      }`}
    >
    
      <header
        className={`sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3 backdrop-blur ${
          isDarkMode
            ? "border-slate-800 bg-[#0B1120]/90 text-slate-100"
            : "border-slate-200 bg-white/90 text-slate-800"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-lg font-bold text-[#0B1120] overflow-hidden">
            <img 
              src="/icon.png" 
              alt="Oggy Logo" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Ask For OGGY</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400"></span>
              </span>
              Online
            </span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className={`flex h-9 cursor-pointer w-9 items-center justify-center rounded-full border transition ${
            isDarkMode
              ? "border-slate-700 bg-[#141B2D] text-amber-400 hover:bg-slate-800"
              : "border-slate-300 bg-slate-100 text-[#0B1120] hover:bg-slate-200"
          }`}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

     
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-sm bg-teal-500 text-[#0B1120]"
                    : isDarkMode
                    ? "rounded-bl-sm bg-[#1B2434] text-slate-100"
                    : "rounded-bl-sm bg-slate-200 text-slate-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div
                className={`flex items-center gap-1.5 rounded-2xl rounded-bl-sm px-4 py-3 ${
                  isDarkMode ? "bg-[#1B2434]" : "bg-slate-200"
                }`}
              >
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      <footer
        className={`sticky bottom-0 border-t px-4 py-3 backdrop-blur ${
          isDarkMode
            ? "border-slate-800 bg-[#0B1120]/90"
            : "border-slate-200 bg-white/90"
        }`}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Oggy..."
            className={`flex-1 rounded-full border px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none ${
              isDarkMode
                ? "border-slate-700 bg-[#141B2D] text-slate-100 placeholder:text-slate-500"
                : "border-slate-300 bg-slate-100 text-slate-800 placeholder:text-slate-400"
            }`}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-teal-500 text-[#0B1120] transition hover:bg-teal-400 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}