import React from 'react'

const Leftside = () => {
  return (
    <div className="hidden lg:flex lg:w-2/5 shrink-0 flex-col justify-between p-10 relative overflow-hidden bg-black">
      
      {/* base gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />

      {/* floating glow blobs */}
      <div className="absolute -top-24 -left-20 w-80 h-80 bg-zinc-700/30 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-zinc-600/20 rounded-full blur-3xl animate-float-slower" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float-medium" />

      {/* faint moving grid */}
      <div
        className="absolute inset-0 opacity-[0.06] animate-grid-shift"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* floating particles */}
      <div className="absolute top-16 left-1/3 w-1.5 h-1.5 bg-white rounded-full blur-[1px] animate-particle-1" />
      <div className="absolute top-1/2 left-10 w-1 h-1 bg-zinc-400 rounded-full blur-[1px] animate-particle-2" />
      <div className="absolute bottom-32 right-16 w-2 h-2 bg-zinc-300 rounded-full blur-[1px] animate-particle-3" />
      <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-white rounded-full blur-[1px] animate-particle-1" />

      {/* logo — inline SVG, instant load */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M12 2V22" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
            <path d="M3 7L12 12L21 7" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="12" cy="12" r="2.5" fill="white" />
          </svg>
        </div>
        <span className="text-white text-2xl font-semibold tracking-tight">Builder AI</span>
      </div>

      {/* animated robot illustration */}
      <div className="relative z-10 flex justify-center">
        <svg width="120" height="130" viewBox="0 0 120 130" className="animate-robot-float">
          {/* antenna */}
          <line x1="60" y1="10" x2="60" y2="22" stroke="#a1a1aa" strokeWidth="2" />
          <circle cx="60" cy="7" r="4" fill="white" className="animate-antenna-pulse" />

          {/* head */}
          <rect x="30" y="22" width="60" height="46" rx="14" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
          
          {/* eyes */}
          <circle cx="47" cy="44" r="5" fill="white" className="animate-blink" />
          <circle cx="73" cy="44" r="5" fill="white" className="animate-blink" />

          {/* mouth */}
          <rect x="48" y="56" width="24" height="3" rx="1.5" fill="#52525b" />

          {/* neck */}
          <rect x="54" y="68" width="12" height="8" fill="#27272a" />

          {/* body */}
          <rect x="22" y="76" width="76" height="44" rx="12" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />

          {/* chest light */}
          <circle cx="60" cy="98" r="8" fill="none" stroke="white" strokeWidth="1.5" className="animate-chest-glow" />
          <circle cx="60" cy="98" r="3" fill="white" className="animate-chest-glow" />

          {/* arms */}
          <rect x="8" y="82" width="10" height="26" rx="5" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" className="animate-arm-left" />
          <rect x="102" y="82" width="10" height="26" rx="5" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" className="animate-arm-right" />
        </svg>
      </div>

      <div className="relative z-10">
        <span className="inline-block text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-4">
          ✦ AI-powered website builder
        </span>

        <h2 className="text-white text-4xl font-bold leading-tight mb-4">
          Build Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 animate-gradient-x">
            Website
          </span>
        </h2>

        <p className="text-zinc-400 leading-relaxed max-w-sm">
          Describe your idea and get a working 5-minute website and prototype — easy enough to win hackathons.
        </p>

        <p className="text-zinc-600 text-sm mt-10">
          Copyright © 2026 Builder AI. All rights reserved.
        </p>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 40px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-40px, -30px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -35px); }
        }
        @keyframes grid-shift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
        }
        @keyframes particle-1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          50% { transform: translate(15px, -20px); opacity: 1; }
        }
        @keyframes particle-2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(-20px, 15px); opacity: 0.9; }
        }
        @keyframes particle-3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          50% { transform: translate(10px, 25px); opacity: 1; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes robot-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes antenna-pulse {
          0%, 100% { opacity: 0.5; r: 4; }
          50% { opacity: 1; r: 5; }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes chest-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes arm-left {
          0%, 100% { transform: rotate(0deg); transform-origin: 13px 84px; }
          50% { transform: rotate(-8deg); transform-origin: 13px 84px; }
        }
        @keyframes arm-right {
          0%, 100% { transform: rotate(0deg); transform-origin: 107px 84px; }
          50% { transform: rotate(8deg); transform-origin: 107px 84px; }
        }

        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 13s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 11s ease-in-out infinite; }
        .animate-grid-shift { animation: grid-shift 8s ease-in-out infinite; }
        .animate-particle-1 { animation: particle-1 6s ease-in-out infinite; }
        .animate-particle-2 { animation: particle-2 7s ease-in-out infinite; }
        .animate-particle-3 { animation: particle-3 5s ease-in-out infinite; }
        .animate-gradient-x { background-size: 200% auto; animation: gradient-x 4s ease-in-out infinite; }
        .animate-robot-float { animation: robot-float 4s ease-in-out infinite; }
        .animate-antenna-pulse { animation: antenna-pulse 2s ease-in-out infinite; transform-origin: center; }
        .animate-blink { animation: blink 4s ease-in-out infinite; transform-origin: center; }
        .animate-chest-glow { animation: chest-glow 2.5s ease-in-out infinite; }
        .animate-arm-left { animation: arm-left 3s ease-in-out infinite; }
        .animate-arm-right { animation: arm-right 3s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export default Leftside