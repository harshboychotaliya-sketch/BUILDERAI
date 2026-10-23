// import React, { useEffect, useMemo, useState, useRef } from 'react'
// import {
//   SandpackProvider,
//   SandpackLayout,
//   SandpackCodeEditor,
//   SandpackPreview,
//   useSandpack,
// } from "@codesandbox/sandpack-react"
// import { useAppContext } from '../Context/App-context'
// import { detectDependencies } from '../../utilss/sandpackUtils'
// import { Loader2 } from 'lucide-react'

// function SandpackFileWatcher({ onLiveFileChange }) {
//   const { sandpack } = useSandpack()
//   const { files } = sandpack
//   const debounceRef = useRef(null)

//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current)
//     debounceRef.current = setTimeout(() => {
//       onLiveFileChange(files)
//     }, 600)

//     return () => {
//       if (debounceRef.current) clearTimeout(debounceRef.current)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [files])

//   return null
// }

// // Surfaces Sandpack's internal error state (file + line + message) as a
// // visible overlay. This catches cases where the default error screen
// // doesn't render (e.g. a silent crash leaving a blank white preview) by
// // reading sandpack.error directly instead of relying only on the built-in overlay.
// function SandpackErrorListener() {
//   const { sandpack } = useSandpack()
//   const { error } = sandpack

//   if (!error) return null

//   return (
//     <div className="absolute top-2 right-2 z-50 max-w-sm bg-red-950/95 border border-red-500/30 rounded-lg p-3 text-xs text-red-200 font-mono shadow-xl">
//       <p className="font-semibold text-red-300 mb-1">
//         {error.title || "Build error"}
//         {error.path && <span className="text-red-400"> — {error.path}</span>}
//         {error.line != null && <span className="text-red-400">:{error.line}</span>}
//       </p>
//       <p className="whitespace-pre-wrap leading-relaxed">{error.message}</p>
//     </div>
//   )
// }

// const PreviewPanel = ({ project, activeFile, showCode }) => {
//   const { updateProjectFile } = useAppContext()

//   const [showErrorOverlay] = useState(true)
//   const [liveFiles, setLiveFiles] = useState(project.files || {})
//   const [prevProjectKey, setPrevProjectKey] = useState(`${project._id}-${project.version}`)

//   useEffect(() => {
//     const currentKey = `${project._id}-${project.version}`
//     if (currentKey !== prevProjectKey) {
//       setPrevProjectKey(currentKey)
//       setLiveFiles(project.files || {})
//     }
//   }, [project, prevProjectKey])

//   const sandpackFiles = useMemo(() => {
//     const result = {}
//     for (const [path, content] of Object.entries(liveFiles)) {
//       const code = typeof content === "string" ? content : content?.code || ""
//       result[path] = { code, active: path === activeFile }
//     }
//     return result
//   }, [liveFiles, activeFile])

//   const dependencies = useMemo(() => detectDependencies(liveFiles), [liveFiles])

//   const handleLiveFileChange = (files) => {
//     const normalized = {}
//     for (const [path, entry] of Object.entries(files)) {
//       normalized[path] = entry.code
//     }
//     setLiveFiles(normalized)
//     updateProjectFile(normalized)
//   }

//   if (!project?._id) {
//     return (
//       <div className="w-full h-full flex items-center justify-center bg-zinc-950">
//         <Loader2 size={20} className="text-zinc-600 animate-spin" />
//       </div>
//     )
//   }

//   return (
//     <div className="w-full h-full flex flex-col min-h-0 relative" style={{ height: "100%" }}>
//       <style>{`
//         .sp-wrapper,
//         .sp-layout,
//         .sp-stack,
//         .sp-preview-container,
//         .sp-preview-iframe,
//         .sp-editor,
//         .sp-code-editor {
//           height: 100% !important;
//           min-height: 0 !important;
//         }
//         .sp-wrapper {
//           display: flex !important;
//           flex-direction: column !important;
//           flex: 1 1 auto !important;
//         }
//       `}</style>

//       <SandpackProvider
//         key={project._id}
//         template="react"
//         files={sandpackFiles}
//         customSetup={{ dependencies }}
//         options={{
//           externalResources: ["https://cdn.tailwindcss.com"],
//           showErrorScreen: true,
//           showNavigator: false,
//           logLevel: "info",
//           recompileMode: "delayed",
//           recompileDelay: 600,
//           autorun: true,
//           autoReload: true,
//         }}
//         theme={{
//           colors: {
//             surface1: "#0a0a0a",
//             surface2: "#141414",
//             surface3: "#1f1f1f",
//             clickable: "#a1a1aa",
//             base: "#e4e4e7",
//             disabled: "#52525b",
//             hover: "#ffffff",
//             accent: "#818cf8",
//             error: "#f87171",
//             errorSurface: "#450a0a",
//             warning: "#fbbf24",
//             warningSurface: "#451a03",
//           },
//           syntax: {
//             plain: "#e4e4e7",
//             comment: { color: "#71717a", fontStyle: "italic" },
//             keyword: "#c4b5fd",
//             tag: "#93c5fd",
//             punctuation: "#a1a1aa",
//             definition: "#fbbf24",
//             property: "#67e8f9",
//             static: "#f9a8d4",
//             string: "#86efac",
//           },
//           font: {
//             body: "'Inter', ui-sans-serif, system-ui, sans-serif",
//             mono: "'Fira Code', 'JetBrains Mono', ui-monospace, monospace",
//             size: "13.5px",
//             lineHeight: "1.65",
//           },
//         }}
//         style={{ height: "100%", flex: "1 1 auto", minHeight: 0 }}
//       >
//         <SandpackFileWatcher onLiveFileChange={handleLiveFileChange} />
//         <SandpackErrorListener />
//         <SandpackLayout
//           style={{
//             height: "100%",
//             borderRadius: 0,
//             border: "none",
//             flex: "1 1 auto",
//             minHeight: 0,
//           }}
//         >
//           {showCode && (
//             <SandpackCodeEditor
//               showTabs={false}
//               showLineNumbers
//               showInlineErrors
//               wrapContent
//               style={{ height: "100%" }}
//             />
//           )}
//           {!showCode && (
//             <SandpackPreview
//               showOpenInCodeSandbox={false}
//               showRefreshButton
//               showRestartButton
//               style={{ height: "100%" }}
//             />
//           )}
//         </SandpackLayout>
//       </SandpackProvider>
//     </div>
//   )
// }

// export default PreviewPanel




























import React, { useEffect, useMemo, useRef } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react"
import { useAppContext } from '../Context/App-context'
import { detectDependencies, toPreviewFiles } from '../../utilss/sandpackUtils'
import { Loader2 } from 'lucide-react'

// Saves only what the user actually edited in the code editor
function SandpackFileWatcher({ baseline, pathMap, onEdit }) {
  const { sandpack } = useSandpack()
  const { files } = sandpack
  const timer = useRef(null)

  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const edits = {}
      for (const [previewPath, savedPath] of Object.entries(pathMap)) {
        const current = files[previewPath]?.code
        if (current !== undefined && current !== baseline[previewPath]) {
          edits[savedPath] = current
        }
      }
      if (Object.keys(edits).length > 0) onEdit(edits)
    }, 800)
    return () => clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  return null
}

// Switches the editor to the file picked in the Files tab without resetting edits
function ActiveFileSync({ path }) {
  const { sandpack } = useSandpack()

  useEffect(() => {
    if (path && path !== sandpack.activeFile) sandpack.openFile(path)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  return null
}

const PreviewPanel = ({ project, activeFile, showCode }) => {
  const { updateProjectFile } = useAppContext()
  const projectFiles = project?.files

  const { preview, pathMap } = useMemo(() => toPreviewFiles(projectFiles), [projectFiles])
  const dependencies = useMemo(() => detectDependencies(preview), [preview])

  const sandpackFiles = useMemo(() => {
    const result = {}
    for (const [path, code] of Object.entries(preview)) {
      result[path] = { code }
    }
    return result
  }, [preview])

  const activePreviewPath = useMemo(
    () => Object.keys(pathMap).find((p) => pathMap[p] === activeFile),
    [pathMap, activeFile]
  )

  const handleEdit = (edits) => {
    // merge edits into ALL saved files so nothing (like /backend) gets lost
    updateProjectFile({ ...project.files, ...edits })
  }

  if (!project?._id) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950">
        <Loader2 size={20} className="text-zinc-600 animate-spin" />
      </div>
    )
  }

  if (project.status === "pending" || project.status === "generating") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="flex items-center gap-2 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Generating project files…
        </div>
      </div>
    )
  }

  if (Object.keys(projectFiles || {}).length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-6 py-4 text-sm">
          {project.error || "No project files are available to preview."}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0" style={{ height: "100%" }}>
      <style>{`
        .sp-wrapper,
        .sp-layout,
        .sp-stack,
        .sp-preview-container,
        .sp-preview-iframe,
        .sp-editor,
        .sp-code-editor {
          height: 100% !important;
          min-height: 0 !important;
        }
        .sp-wrapper {
          display: flex !important;
          flex-direction: column !important;
          flex: 1 1 auto !important;
        }
      `}</style>

      <SandpackProvider
        key={`${project._id}-${project.version}`}
        template="react"
        files={sandpackFiles}
        customSetup={{ dependencies }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
          ],
          showErrorScreen: true,
          logLevel: "error",
          recompileMode: "delayed",
          recompileDelay: 600,
          autorun: true,
          autoReload: true,
        }}
        theme={{
          colors: {
            surface1: "#0a0a0a",
            surface2: "#141414",
            surface3: "#1f1f1f",
            clickable: "#a1a1aa",
            base: "#e4e4e7",
            disabled: "#52525b",
            hover: "#ffffff",
            accent: "#818cf8",
            error: "#f87171",
            errorSurface: "#450a0a",
            warning: "#fbbf24",
            warningSurface: "#451a03",
          },
          syntax: {
            plain: "#e4e4e7",
            comment: { color: "#71717a", fontStyle: "italic" },
            keyword: "#c4b5fd",
            tag: "#93c5fd",
            punctuation: "#a1a1aa",
            definition: "#fbbf24",
            property: "#67e8f9",
            static: "#f9a8d4",
            string: "#86efac",
          },
          font: {
            body: "'Inter', ui-sans-serif, system-ui, sans-serif",
            mono: "'Fira Code', 'JetBrains Mono', ui-monospace, monospace",
            size: "13.5px",
            lineHeight: "1.65",
          },
        }}
        style={{ height: "100%", flex: "1 1 auto", minHeight: 0 }}
      >
        <SandpackFileWatcher baseline={preview} pathMap={pathMap} onEdit={handleEdit} />
        <ActiveFileSync path={activePreviewPath} />
        <SandpackLayout style={{ height: "100%", borderRadius: 0, border: "none", flex: "1 1 auto", minHeight: 0 }}>
          {showCode && (
            <SandpackCodeEditor
              showTabs={false}
              showLineNumbers
              showInlineErrors
              wrapContent
              style={{ height: "100%" }}
            />
          )}
          {!showCode && (
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton
              showRestartButton
              style={{ height: "100%" }}
            />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}

export default PreviewPanel