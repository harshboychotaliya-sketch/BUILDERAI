import React, { useMemo } from 'react'
import { FileCode2Icon, FileTextIcon, FolderIcon, FileIcon } from 'lucide-react'

function buildTree(paths) {
  const root = []

  for (const filepath of paths.sort()) {
    const parts = filepath.split("/").filter(Boolean)
    let current = root

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i]
      const isLast = i === parts.length - 1
      const fullPath = "/" + parts.slice(0, i + 1).join("/")

      let existing = current.find((n) => n.name === name)
      if (!existing) {
        existing = {
          name,
          path: fullPath,
          isDir: !isLast,
          children: [],
        }
        current.push(existing)
      }
      current = existing.children
    }
  }

  return root
}

function getFileIcon(name) {
  if (name.endsWith(".css")) return <FileTextIcon size={13} className="text-blue-400" />
  if (name.endsWith(".jsx") || name.endsWith(".js")) return <FileCode2Icon size={13} className="text-amber-400" />
  if (name.endsWith(".json")) return <FileTextIcon size={13} className="text-zinc-400" />
  return <FileIcon size={13} className="text-zinc-500" />
}

function TreeItem({ node, activeFile, onFileSelect, depth = 0 }) {
  const isActive = node.path === activeFile

  if (node.isDir) {
    return (
      <div className="animate-fade-in">
        <div
          className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-zinc-400 select-none"
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <FolderIcon size={13} className="text-zinc-500 shrink-0" />
          <span className="truncate">{node.name}</span>
        </div>
        {node.children.map((child) => (
          <TreeItem
            key={child.path}
            node={child}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
            depth={depth + 1}
          />
        ))}
      </div>
    )
  }

  return (
    <button
      onClick={() => onFileSelect(node.path)}
      style={{ paddingLeft: `${depth * 14 + 8}px` }}
      className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-left text-xs rounded-md transition-all duration-150 animate-fade-in ${
        isActive
          ? "bg-white/10 text-white"
          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05]"
      }`}
    >
      {getFileIcon(node.name)}
      <span className="truncate">{node.name}</span>
    </button>
  )
}

const FileExplorer = ({ files, activeFile, onFileSelect }) => {
  const tree = useMemo(() => buildTree(Object.keys(files || {})), [files])

  return (
    <div className="h-full overflow-y-auto py-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 px-3 pb-2">
        Files
      </p>

      {tree.length === 0 ? (
        <p className="text-xs text-zinc-600 px-3 py-2">No files yet</p>
      ) : (
        tree.map((node) => (
          <TreeItem
            key={node.path}
            node={node}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
          />
        ))
      )}

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  )
}

export default FileExplorer