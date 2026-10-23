import React, { useState, useMemo } from 'react'
import { detectDependencies, toPreviewFiles } from '../../utilss/sandpackUtils'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react'

const FullPagePreview = ({ project, files, showCode }) => {
  const [showErrorOverlay, setShowErrorOverlay] = useState(true)
  const hasFiles = Boolean(files && Object.keys(files).length > 0)
  const { preview } = useMemo(() => toPreviewFiles(files), [files])

  const sandpackFiles = useMemo(() => {
    const result = {}
    for (const [path, code] of Object.entries(preview)) {
      result[path] = { code }
    }
    return result
  }, [preview])

  const dependencies = useMemo(() => detectDependencies(preview), [preview])

  if (!hasFiles) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-6 py-4 text-sm">
          No project files are available yet. Generate a project to preview it here.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col" style={{ height: "100vh", minHeight: "100vh" }}>
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
          height: 100vh !important;
          min-height: 100vh !important;
        }
      `}</style>

      <SandpackProvider
        key={project?._id}
        template="react"
        files={sandpackFiles}
        customSetup={{ dependencies }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js",
            "https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.min.js",
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
          ],
          showErrorScreen: showErrorOverlay,
          logLevel: "error",
          recompileMode: "delayed",
          recompileDelay: 300,
          autorun: true,
          autoReload: true,
        }}
        className="w-full h-full"
      >
        <SandpackLayout style={{ height: "100vh", minHeight: "100vh" }}>
          {showCode && (
            <SandpackCodeEditor
              onErrorChange={setShowErrorOverlay}
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
              style={{ height: "100vh", minHeight: "100vh" }}
            />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}

export default FullPagePreview

