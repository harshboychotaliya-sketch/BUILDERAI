import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../Context/App-context'
import Loading from '../Componets/Loading'
import Header from '../Componets/header'
import ChatPanel from '../Componets/chatpanel'
import FileExplorer from '../Componets/fileexploar'
import PreviewPanel from '../Componets/prawpanel'
import { FolderTreeIcon, MessagesSquareIcon } from 'lucide-react'
import api from '../API/api'
import toast from 'react-hot-toast'
import { exportProjectZip } from '../../utilss/export'

const Buildepahe = () => {
  const { id } = useParams()
  const {
    activeProject,
    loadingActiveProject,
    activeFile,
    setActiveFile,
    showCode,
    setShowCode,
    chatLoading,
    setChatLoading,
    loadProject,
    logout,
  } = useAppContext()

  const [publishing, setPublishing] = useState(false)
  const [leftTab, setLeftTab] = useState("chat")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (id) loadProject(id)
  }, [id, loadProject])

  useEffect(() => {
    if (!id || !activeProject) return
    if (activeProject.status === "pending" || activeProject.status === "generating") {
      const interval = setInterval(() => {
        loadProject(id, true)
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [id, loadProject, activeProject])

  const handlePublish = async () => {
    if (!id) return
    setPublishing(true)
    try {
      await api.post(`/api/projects/${id}/publish`)
      const url = `${window.location.origin}/publish/${id}`
      toast.success(`Project successfully published! At this URL: ${url}`)
    
    } catch (err) {
      console.error("Publish failed:", err)
    } finally {
      setPublishing(false)
    }
  }

  const handleDownload = () => {
    if (!activeProject) return
    exportProjectZip(activeProject)
  }

  const handleOpenPreview = () => {
    if (!id) return
    const url = `${window.location.origin}/priviwepage/${id}`
    window.open(url, "_blank")
  }

  const handleSendMessage = useCallback(async (prompt) => {
    if (!activeProject) return

    setMessages((prev) => [...prev, { role: "user", content: prompt }])
    setChatLoading(true)

    try {
      const { data } = await api.post(`/api/projects/${activeProject._id}/chat`, { prompt })

      if (data.error) {
        toast.error("Sorry, the project failed — something went wrong.")
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong generating that. Please try again." },
        ])
      } else {
        toast.success("Project updated")
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply || "Done — I've updated your project." },
        ])
        await loadProject(activeProject._id, true)
      }
    } catch (err) {
      console.error("Chat failed:", err)
      const errorMessage =
        err.response?.data?.message || "The AI service could not update this project. Please try again."
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ])
      toast.error(errorMessage)
    } finally {
      setChatLoading(false)
    }
  }, [activeProject, loadProject, setChatLoading])

  if (loadingActiveProject || !activeProject) {
    return <Loading />
  }

  return (
    <div className="h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black pointer-events-none" />
      <div className="absolute -top-24 -left-20 w-80 h-80 bg-zinc-700/20 rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-zinc-600/15 rounded-full blur-3xl animate-float-slower pointer-events-none" />

      <Header
        projectName={activeProject.name || activeProject.prompt}
        version={activeProject.version}
        showCode={showCode}
        publishing={publishing}
        onToggleShowCode={() => setShowCode(!showCode)}
        onOpenPreview={handleOpenPreview}
        onPublish={handlePublish}
        onDownload={handleDownload}
        onLogout={logout}
      />
        {activeProject.status === "failed" && (
        <div className="relative z-10 mx-4 md:mx-8 mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Generation failed: {activeProject.error || "unknown error"}
        </div>
      )}

      <div className="relative z-10 flex flex-1 min-h-0 mt-4 mx-4 md:mx-8 mb-4 gap-4">
        <div className="w-[380px] shrink-0 flex flex-col rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden animate-panel-in">
          <div className="flex items-center border-b border-white/[0.08] shrink-0">
            <button
              onClick={() => setLeftTab("chat")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all duration-200 relative ${
                leftTab === "chat" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <MessagesSquareIcon size={13} />
              Chat
              {leftTab === "chat" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-white rounded-full animate-tab-underline" />
              )}
            </button>

            <button
              onClick={() => setLeftTab("file")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all duration-200 relative ${
                leftTab === "file" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <FolderTreeIcon size={13} />
              Files
              {leftTab === "file" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-white rounded-full animate-tab-underline" />
              )}
            </button>
          </div>

          <div className="flex-1 min-h-0">
            {leftTab === "chat" ? (
              <ChatPanel messages={messages} onSend={handleSendMessage} loading={chatLoading} />
            ) : (
              <FileExplorer files={activeProject.files} activeFile={activeFile} onFileSelect={setActiveFile} />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col h-full rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden animate-panel-in" style={{ animationDelay: "80ms" }}>
          <PreviewPanel project={activeProject} activeFile={activeFile} showCode={showCode} />
        </div>
      </div>

      <style>{`
        @keyframes float-slow { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(35px, 45px) scale(1.06); } }
        @keyframes float-slower { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-45px, -35px) scale(1.04); } }
        @keyframes panel-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes tab-underline { 0% { width: 0; opacity: 0; } 100% { width: 2rem; opacity: 1; } }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes fade-in-left { 0% { opacity: 0; transform: translateX(-6px); } 100% { opacity: 1; transform: translateX(0); } }

        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 13s ease-in-out infinite; }
        .animate-panel-in { opacity: 0; animation: panel-in 0.4s ease-out forwards; }
        .animate-tab-underline { animation: tab-underline 0.25s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.25s ease-out forwards; }
        .animate-fade-in-left { opacity: 0; animation: fade-in-left 0.3s ease-out forwards; }
      `}</style>
    </div>
  )
}

export default Buildepahe





