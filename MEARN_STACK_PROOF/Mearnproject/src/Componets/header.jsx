import React from 'react'
import {
  Code2Icon,
  Download,
  ExternalLinkIcon,
  EyeIcon,
  Globe2Icon,
  Loader2Icon,
  LogOut,
} from 'lucide-react'

const Header = ({
  projectName,
  version,
  showCode,
  publishing,
  onToggleShowCode,
  onOpenPreview,
  onPublish,
  onDownload,
  onLogout,
}) => {
  return (
    <header className=" mb-3 animate-header-in sticky top-4 mx-4 md:mx-8 flex items-center justify-between rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] px-5 py-3 relative z-20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-2xl" />

      {/* left: back + logo + project name */}
      <div className="flex items-center gap-3 min-w-0">
        {/* <button
          onClick={navigation => navigation("/Builderpage")}
          className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-all duration-200 shrink-0"
        >
          <ArrowLeftIcon size={16} />
        </button> */}

        <div className="size-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 animate-logo-pulse">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M12 2V22" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
            <path d="M3 7L12 12L21 7" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="12" cy="12" r="2.5" fill="white" />
          </svg>
        </div>

        <div className="min-w-0">
          <span className="text-sm font-medium text-white truncate block">
            {projectName || "Untitled project"}
          </span>
          {version && (
            <span className="text-[11px] text-zinc-500">v{version}</span>
          )}
        </div>
      </div>

      {/* right: actions */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
        <button
          onClick={onToggleShowCode}
          className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white hover:scale-[1.03] active:scale-[0.97] text-xs font-medium rounded-lg px-3 py-1.5 transition-all duration-200"
        >
          {showCode ? (
            <>
              <EyeIcon size={13} />
              Preview
            </>
          ) : (
            <>
              <Code2Icon size={13} />
              Code
            </>
          )}
        </button>

        <button
          onClick={onOpenPreview}
          className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white hover:scale-[1.03] active:scale-[0.97] text-xs font-medium rounded-lg px-3 py-1.5 transition-all duration-200"
        >
          <ExternalLinkIcon size={13} />
          Open preview
        </button>

        <button
          onClick={onPublish}
          disabled={publishing}
          className={`flex items-center gap-1.5 border border-white/10 text-white hover:bg-white/[0.15] hover:scale-[1.03] active:scale-[0.97] text-xs font-medium rounded-lg px-3 py-1.5 transition-all duration-200 disabled:hover:scale-100 ${
            publishing ? "bg-white/10 opacity-80" : "bg-white/10 animate-publish-glow"
          }`}
        >
          {publishing ? (
            <Loader2Icon size={13} className="animate-spin" />
          ) : (
            <Globe2Icon size={13} />
          )}
          {publishing ? "Publishing…" : "Publish"}
        </button>

        <button
          onClick={onDownload}
          className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white hover:scale-[1.03] active:scale-[0.97] text-xs font-medium rounded-lg px-3 py-1.5 transition-all duration-200"
        >
          <Download size={13} />
          Download
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 hover:scale-[1.03] active:scale-[0.97] text-xs font-medium rounded-lg px-3 py-1.5 transition-all duration-200"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>

      <style>{`
        @keyframes header-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes logo-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.08); }
          50% { box-shadow: 0 0 0 4px rgba(255,255,255,0.04); }
        }
        @keyframes publish-glow {
          0%, 100% { box-shadow: 0 2px 10px rgba(255,255,255,0.06); }
          50% { box-shadow: 0 4px 18px rgba(255,255,255,0.16); }
        }

        .animate-header-in { animation: header-in 0.4s ease-out forwards; }
        .animate-logo-pulse { animation: logo-pulse 3s ease-in-out infinite; }
        .animate-publish-glow { animation: publish-glow 3s ease-in-out infinite; }
      `}</style>
    </header>
  )
}

export default Header





