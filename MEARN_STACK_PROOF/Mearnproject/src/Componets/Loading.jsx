import React from 'react'

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* ambient background, matching the rest of the app */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      {/* logo mark with spinning ring */}
      <div className="relative z-10 flex items-center justify-center size-16 mb-6">
        <svg className="absolute inset-0 animate-spin-slow" viewBox="0 0 64 64" fill="none">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="white"
            strokeOpacity="0.1"
            strokeWidth="2"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="40 136"
          />
        </svg>
        <div className="size-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M12 2V22" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
            <path d="M3 7L12 12L21 7" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="12" cy="12" r="2.5" fill="white" />
          </svg>
        </div>
      </div>

      <p className="relative z-10 text-sm text-zinc-400 animate-fade-pulse">Loading your project…</p>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes fade-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .animate-spin-slow { animation: spin-slow 1.4s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-fade-pulse { animation: fade-pulse 1.8s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export default Loading