import React, { useState, useEffect } from 'react'
import { useAppContext } from '../Context/App-context'
import PromptInput from '../Componets/promptinput'
import { Sparkles, LayoutGrid, ClockIcon, Trash2, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Homepage = () => {
  const navigate = useNavigate()
  const {
    user,
    logout,
    projects,
    loadingProjects,
    loadProjects,
    createProject,
    generatingProject,
    deleteProject,
    handleAbout,
  } = useAppContext()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const handleGenerate = async (text) => {
    setLoading(true)
    try {
      await createProject(text)
    } catch (err) {
      console.error("Generation failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    e.preventDefault()
    deleteProject(id)
  }

  const timeAgo = (dateStr) => {
    if (!dateStr) return "—"
    const diffMs = Date.now() - new Date(dateStr).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
    if (diffDays === 1) return "a day ago"
    return `${diffDays} days ago`
  }

  const homeTags = [
    "Portfolio site", "SaaS landing page", "E-commerce store",
    "Restaurant menu", "Fitness tracker", "Blog platform", "Healthcare web app"
  ]

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col">

      {/* ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black pointer-events-none" />
      <div className="absolute -top-24 -left-20 w-80 h-80 bg-zinc-700/20 rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-zinc-600/15 rounded-full blur-3xl animate-float-slower pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float-medium pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-white/[0.03] rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.04] animate-grid-shift pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="absolute top-24 left-1/4 w-1.5 h-1.5 bg-white rounded-full blur-[1px] animate-particle-1 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-zinc-400 rounded-full blur-[1px] animate-particle-2 pointer-events-none" />
      <div className="absolute bottom-1/3 left-16 w-2 h-2 bg-zinc-300 rounded-full blur-[1px] animate-particle-3 pointer-events-none" />
      <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-white rounded-full blur-[1px] animate-particle-1 pointer-events-none" />
      <div className="absolute bottom-24 right-16 w-1.5 h-1.5 bg-zinc-400 rounded-full blur-[1px] animate-particle-2 pointer-events-none" />
      <div className="absolute top-40 right-1/2 w-1 h-1 bg-zinc-300 rounded-full blur-[1px] animate-particle-3 pointer-events-none" />
      <div className="absolute bottom-40 left-1/3 w-1.5 h-1.5 bg-white rounded-full blur-[1px] animate-particle-1 pointer-events-none" />

      <svg className="absolute top-16 right-1/4 w-24 h-24 opacity-[0.08] animate-spin-slow pointer-events-none" viewBox="0 0 100 100">
        <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="white" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-20 left-1/5 w-16 h-16 opacity-[0.07] animate-spin-reverse pointer-events-none" viewBox="0 0 100 100">
        <rect x="15" y="15" width="70" height="70" fill="none" stroke="white" strokeWidth="1" />
      </svg>

      <div className="absolute top-16 right-1/4 w-24 h-24 pointer-events-none">
        <div className="relative w-full h-full animate-spin-orbit">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/40 rounded-full blur-[0.5px]" />
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/2 w-1/3 h-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -skew-x-12 animate-beam-sweep" />
      </div>

      {/* glassmorphic nav */}
      <nav className="sticky top-4 mx-4 md:mx-8 flex items-center justify-between rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] px-6 py-3.5 relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-2xl" />
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M12 2V22" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
              <path d="M3 7L12 12L21 7" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
              <circle cx="12" cy="12" r="2.5" fill="white" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight text-xl text-white">Builder AI</span>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium text-zinc-300">
          <span>Welcome, {user?.name}</span>
          <button
            onClick={logout}
            className="bg-white/10 border border-white/10 text-white rounded-lg px-4 py-2 hover:bg-white/[0.15] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Sign out
          </button>
          <button
            onClick={handleAbout}
            className="bg-white/10 border border-white/10 text-white rounded-lg px-4 py-2 hover:bg-white/[0.15] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            About
          </button>
        </div>
      </nav>

      {/* hero + prompt input */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <span className="inline-block text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-6">
          ✦ AI-powered website builder
        </span>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 max-w-2xl">
          What do you want to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 animate-gradient-x">
            build
          </span>{" "}
          today?
        </h1>
        <p className="text-zinc-400 max-w-md leading-relaxed mb-10">
          Describe your idea and get a working 5-minute website and prototype — easy enough to win hackathons.
        </p>

        <div className="w-full max-w-2xl">
          <PromptInput
            variant="glass"
            large
            autoFocus
            loading={loading}
            onSubmit={handleGenerate}
          />
        </div>

        {/* scrolling marquee tag */}
        <div className="masked-marquee w-full overflow-hidden mt-4 py-1 max-w-2xl">
          <div className="animate-marquee flex gap-3 whitespace-nowrap w-max">
            {[...homeTags, ...homeTags].map((tag, i) => (
              <button
                key={i}
                onClick={() => handleGenerate(tag)}
                disabled={loading || Boolean(generatingProject)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles size={11} className="text-zinc-500" />
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* project history */}
        <div className="w-full max-w-2xl mt-8 text-left">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid size={14} className="text-zinc-500" />
            <p className="text-sm text-zinc-400 uppercase tracking-wide">All Projects</p>
            {!loadingProjects && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                {projects.length} {projects.length === 1 ? "project" : "projects"}
              </span>
            )}
          </div>

          {loadingProjects ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-8 text-center">
              <p className="text-zinc-500 text-sm">
                No projects yet — describe an idea above to build your first one.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {projects.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/Builderpage/${p._id}`)}
                  className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12] cursor-pointer transition-all duration-200"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {p.name || p.prompt || "Untitled project"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                        <ClockIcon size={10} />
                        {timeAgo(p.updatedAt || p.createdAt)}
                      </span>
                      {p.version && (
                        <span className="text-xs text-zinc-600">v{p.version}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        p.status === "ready"
                          ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                          : p.status === "generating" || p.status === "pending"
                          ? "text-amber-400 border-amber-500/20 bg-amber-500/10"
                          : "text-zinc-400 border-white/10 bg-white/5"
                      }`}
                    >
                      {p.status || "ready"}
                    </span>

                    <button
                      onClick={(e) => handleDelete(e, p._id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg p-1.5 transition-all duration-200"
                      title="Delete project"
                    >
                      <Trash2 size={13} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/Builderpage/${p._id}`)
                      }}
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-all duration-200"
                      title="Open project"
                    >
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(35px, 45px) scale(1.06); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-45px, -35px) scale(1.04); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(25px, -30px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes grid-shift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
        }
        @keyframes particle-1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(20px, -25px); opacity: 0.9; }
        }
        @keyframes particle-2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          50% { transform: translate(-25px, 20px); opacity: 1; }
        }
        @keyframes particle-3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(15px, 30px); opacity: 0.8; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes spin-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes beam-sweep {
          0% { transform: translateX(0) skewX(-12deg); }
          100% { transform: translateX(400%) skewX(-12deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 13s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 11s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 6s ease-in-out infinite; }
        .animate-grid-shift { animation: grid-shift 8s ease-in-out infinite; }
        .animate-particle-1 { animation: particle-1 7s ease-in-out infinite; }
        .animate-particle-2 { animation: particle-2 8s ease-in-out infinite; }
        .animate-particle-3 { animation: particle-3 6.5s ease-in-out infinite; }
        .animate-gradient-x { background-size: 200% auto; animation: gradient-x 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 22s linear infinite; transform-origin: center; }
        .animate-spin-reverse { animation: spin-reverse 28s linear infinite; transform-origin: center; }
        .animate-spin-orbit { animation: spin-orbit 10s linear infinite; }
        .animate-beam-sweep { animation: beam-sweep 7s ease-in-out infinite; animation-delay: 2s; }
        .animate-marquee { animation: marquee 20s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }

        .masked-marquee {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }
      `}</style>
    </div>
  )
}

export default Homepage
