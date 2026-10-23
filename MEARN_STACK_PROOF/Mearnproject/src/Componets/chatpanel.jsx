import React, { useEffect, useRef } from 'react'
import { BotMessageSquare, UserIcon } from 'lucide-react'
import PromptInput from '../Componets/promptinput'

const ChatPanel = ({ messages, onSend, loading }) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  return (
    <div className="flex flex-col h-full bg-white/[0.015]">
      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <BotMessageSquare size={22} className="text-zinc-600 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">Ask AI to build or change your website</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 animate-msg-in ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}
          >
            <div
              className={`shrink-0 size-7 rounded-lg flex items-center justify-center ${
                msg.role === "user"
                  ? "bg-white/10 border border-white/10"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {msg.role === "user" ? (
                <UserIcon size={13} className="text-zinc-300" />
              ) : (
                <BotMessageSquare size={13} className="text-zinc-300" />
              
              )}
            </div>

            <div className={`min-w-0 max-w-[85%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <p className="text-[11px] text-zinc-500 mb-1">
                {msg.role === "user" ? "You" : "AI"}
              </p>
              <div
                className={`inline-block rounded-xl px-3.5 py-2.5 text-sm leading-relaxed text-left ${
                  msg.role === "user"
                    ? "bg-white text-black"
                    : "bg-white/[0.06] border border-white/[0.08] text-zinc-200"
                }`}
              >
                {msg.content.split("`").map((part, idx) =>
                  idx % 2 === 1 ? (
                    <code
                      key={idx}
                      className={`px-1 py-0.5 rounded text-xs font-mono ${
                        msg.role === "user" ? "bg-black/10" : "bg-white/10 text-zinc-100"
                      }`}
                    >
                      {part}
                    </code>
                  ) : (
                    <span key={idx}>{part}</span>
                  )
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 animate-fade-in">
            <div className="shrink-0 size-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center animate-pulse-soft">
              <BotMessageSquare size={13} className="text-zinc-300" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 mb-1">AI</p>
              <div className="inline-flex items-center gap-1 bg-white/[0.06] border border-white/[0.08] rounded-xl px-3.5 py-3">
                <span className="dot-loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="p-3 border-t border-white/[0.08]">
        <PromptInput
          variant="glass"
          onSubmit={onSend}
          loading={loading}
          placeholder="Ask AI…"
          autoFocus
        />
      </div>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes msg-in {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-soft {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.06); }
          50% { box-shadow: 0 0 0 4px rgba(255,255,255,0.05); }
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }

        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-msg-in { opacity: 0; animation: msg-in 0.35s ease-out forwards; }
        .animate-pulse-soft { animation: pulse-soft 1.6s ease-in-out infinite; }

        .dot-loader {
          display: inline-flex;
          gap: 4px;
        }
        .dot-loader span {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.6);
          animation: dot-bounce 1.2s infinite ease-in-out;
        }
        .dot-loader span:nth-child(1) { animation-delay: 0s; }
        .dot-loader span:nth-child(2) { animation-delay: 0.15s; }
        .dot-loader span:nth-child(3) { animation-delay: 0.3s; }
      `}</style>
    </div>
  )
}

export default ChatPanel