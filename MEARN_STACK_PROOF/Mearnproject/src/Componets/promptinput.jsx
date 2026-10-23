import React, { useEffect, useRef, useState } from 'react'
import { ArrowUp, CloudUpload, X } from 'lucide-react'

const PromptInput = ({
  onSubmit,
  loading = false,
  placeholder = "Describe your website idea...",
  large = false,
  autoFocus = false,
  variant = "default",
}) => {
  const [value, setValue] = useState("")
  const [file, setFile] = useState(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e) => {
    e?.preventDefault()
    const trimmed = value.trim()
    if ((!trimmed && !file) || loading) return
    onSubmit?.(trimmed, file)
    setValue("")
    setFile(null)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${Math.min(el.scrollHeight, 240)}px`
    }
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
    e.target.value = ""
  }

  const isGlass = variant === "glass"

  if (isGlass) {
    return (
      <form
        onSubmit={handleSubmit}
        className="relative w-full rounded-2xl transition-all duration-200 bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] focus-within:border-white/20 focus-within:bg-white/[0.08]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-2xl pointer-events-none" />

        {file && (
          <div className="flex items-center gap-2 mx-4 mt-3 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 w-fit">
            <span className="text-xs text-zinc-300 max-w-[160px] truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-zinc-400 hover:text-white transition-colors duration-150"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 px-4 py-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            rows={large ? 3 : 1}
            disabled={loading}
            className={`flex-1 resize-none bg-transparent outline-none leading-relaxed placeholder:text-zinc-500 disabled:opacity-50 text-white ${
              large ? "text-lg min-h-[72px]" : "text-base min-h-[24px]"
            }`}
          />

          <label
            htmlFor="file"
            className="shrink-0 flex items-center justify-center rounded-lg size-9 cursor-pointer text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <CloudUpload size={18} />
            <input type="file" id="file" hidden onChange={handleFileChange} />
          </label>

          <button
            type="submit"
            disabled={loading || (!value.trim() && !file)}
            className="shrink-0 flex items-center justify-center rounded-lg size-9 transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] disabled:opacity-40 disabled:hover:scale-100 bg-white/10 border border-white/10 text-white hover:bg-white/[0.15]"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-current/40 border-t-current rounded-full animate-spin" />
            ) : (
              <ArrowUp size={16} />
            )}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full rounded-2xl transition-all duration-200 bg-white border border-zinc-300 shadow-sm focus-within:border-zinc-900"
    >
      {file && (
        <div className="flex items-center gap-2 mx-4 mt-3 px-3 py-1.5 rounded-lg bg-zinc-100 border border-zinc-200 w-fit">
          <span className="text-xs text-zinc-600 max-w-[160px] truncate">{file.name}</span>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="text-zinc-400 hover:text-zinc-900 transition-colors duration-150"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 px-4 py-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={large ? 3 : 1}
          disabled={loading}
          className={`flex-1 resize-none bg-transparent outline-none leading-relaxed placeholder:text-zinc-500 disabled:opacity-50 text-zinc-900 ${
            large ? "text-lg min-h-[72px]" : "text-base min-h-[24px]"
          }`}
        />

        <label
          htmlFor="file"
          className="shrink-0 flex items-center justify-center rounded-lg size-9 cursor-pointer text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200"
        >
          <CloudUpload size={18} />
          <input type="file" id="file" hidden onChange={handleFileChange} />
        </label>

        <button
          type="submit"
          disabled={loading || (!value.trim() && !file)}
          className="shrink-0 flex items-center justify-center rounded-lg size-9 transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] disabled:opacity-40 disabled:hover:scale-100 bg-zinc-900 text-white hover:bg-zinc-800"
        >
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-current/40 border-t-current rounded-full animate-spin" />
          ) : (
            <ArrowUp size={16} />
          )}
        </button>
      </div>
    </form>
  )
}

export default PromptInput