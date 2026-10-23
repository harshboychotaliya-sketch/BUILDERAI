import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import toast from 'react-hot-toast'
import api from '../API/api'
import {
  ArrowLeft, Sparkles, Code2, Eye, Zap, Layers, MessageSquare,
  Download, Globe2, FileCode, Palette, Rocket, CheckCircle2,
  Phone, Mail, Star, HelpCircle, Send, ArrowUp, Quote, Box,
  Users, GraduationCap, Briefcase, Lightbulb, X, Check, Map,
} from 'lucide-react'

// fades/scales/blurs an element in once it scrolls into view
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

function Reveal({ children, delay = 0, className = "", variant = "up" }) {
  const [ref, visible] = useReveal()

  const variants = {
    up: visible ? "opacity-100 translate-y-0 blur-0 scale-100" : "opacity-0 translate-y-10 blur-0 scale-100",
    scale: visible ? "opacity-100 translate-y-0 blur-0 scale-100" : "opacity-0 translate-y-4 blur-0 scale-90",
    blur: visible ? "opacity-100 translate-y-0 blur-0 scale-100" : "opacity-0 translate-y-6 blur-md scale-[0.97]",
    left: visible ? "opacity-100 translate-x-0 blur-0" : "opacity-0 -translate-x-10 blur-0",
    right: visible ? "opacity-100 translate-x-0 blur-0" : "opacity-0 translate-x-10 blur-0",
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${variants[variant] || variants.up}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// a 3D cube that rotates based on how far it's scrolled through the viewport
function ScrollCube({ size = 90 }) {
  const wrapRef = useRef(null)
  const cubeRef = useRef(null)

  useEffect(() => {
    function update() {
      const el = wrapRef.current
      const cube = cubeRef.current
      if (!el || !cube) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // progress: -1 (below viewport) -> 0 (centered) -> 1 (above viewport)
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh

      const rotateX = progress * 180
      const rotateY = progress * 220
      const translateY = progress * -40

      cube.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const half = size / 2

  const faceBase = {
    position: "absolute",
    width: size,
    height: size,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
    backdropFilter: "blur(2px)",
  }

  return (
    <div ref={wrapRef} className="flex items-center justify-center py-10" style={{ perspective: 900 }}>
      <div
        ref={cubeRef}
        style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d", transition: "transform 0.05s linear" }}
      >
        <div style={{ ...faceBase, transform: `translateZ(${half}px)` }} />
        <div style={{ ...faceBase, transform: `rotateY(180deg) translateZ(${half}px)` }} />
        <div style={{ ...faceBase, transform: `rotateY(90deg) translateZ(${half}px)` }} />
        <div style={{ ...faceBase, transform: `rotateY(-90deg) translateZ(${half}px)` }} />
        <div style={{ ...faceBase, transform: `rotateX(90deg) translateZ(${half}px)` }} />
        <div style={{ ...faceBase, transform: `rotateX(-90deg) translateZ(${half}px)` }} />
      </div>
    </div>
  )
}

// a flat ring that tilts in 3D space as it crosses the viewport
function ScrollRing({ size = 220 }) {
  const wrapRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    function update() {
      const el = wrapRef.current
      const ring = ringRef.current
      if (!el || !ring) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh

      const rotateX = 65 + progress * 40
      const rotateZ = progress * 160

      ring.style.transform = `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div ref={wrapRef} className="flex items-center justify-center py-14" style={{ perspective: 1000 }}>
      <div
        ref={ringRef}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.25)",
          boxShadow: "0 0 60px rgba(255,255,255,0.06) inset, 0 0 40px rgba(255,255,255,0.04)",
          transition: "transform 0.05s linear",
        }}
      />
    </div>
  )
}

// a card that tilts toward the viewer as it scrolls past center
function ScrollTiltCard({ children }) {
  const wrapRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    function update() {
      const el = wrapRef.current
      const card = cardRef.current
      if (!el || !card) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh
      const clamped = Math.max(-1, Math.min(1, progress))

      card.style.transform = `rotateX(${clamped * -12}deg) rotateY(${clamped * 14}deg) translateZ(0)`
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div ref={wrapRef} style={{ perspective: 1200 }}>
      <div ref={cardRef} style={{ transformStyle: "preserve-3d", transition: "transform 0.05s linear" }}>
        {children}
      </div>
    </div>
  )
}

const HandleAbout = () => {
  const blob1Ref = useRef(null)
  const blob2Ref = useRef(null)
  const blob3Ref = useRef(null)
  const lenisRef = useRef(null)

  const [progress, setProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const [feedbackForm, setFeedbackForm] = useState({ name: "", email: "", message: "" })
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)

  // --- Lenis smooth scroll + scroll progress + parallax ---
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on("scroll", ({ scroll }) => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? Math.min(100, (scroll / total) * 100) : 0)
      setShowScrollTop(scroll > 600)

      if (blob1Ref.current) blob1Ref.current.style.transform = `translateY(${scroll * 0.15}px)`
      if (blob2Ref.current) blob2Ref.current.style.transform = `translateY(${scroll * -0.12}px)`
      if (blob3Ref.current) blob3Ref.current.style.transform = `translateY(${scroll * 0.08}px)`
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const rafId = requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
    }
  }, [])

  const scrollToTop = () => {
    lenisRef.current?.scrollTo(0, { duration: 1.4 })
  }

  const handleFeedbackChange = (field) => (e) => {
    setFeedbackForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()

    if (!feedbackForm.message.trim()) {
      toast.error("Please write some feedback first")
      return
    }

    setFeedbackSubmitting(true)
    try {
      await api.post('/api/feedback', feedbackForm)
      toast.success("Thanks for your feedback!")
      setFeedbackForm({ name: "", email: "", message: "" })
    } catch (error) {
      console.error("Feedback submit failed:", error)
      const subject = encodeURIComponent(`Feedback from ${feedbackForm.name || "a user"}`)
      const body = encodeURIComponent(
        `${feedbackForm.message}\n\nFrom: ${feedbackForm.name || "Anonymous"} (${feedbackForm.email || "no email given"})`
      )
      window.location.href = `mailto:harshchotaliya37@gmail.com?subject=${subject}&body=${body}`
      toast.success("Opening your email client to send feedback")
    } finally {
      setFeedbackSubmitting(false)
    }
  }

  const features = [
    { icon: MessageSquare, title: "Describe in plain English", desc: "Tell Builder AI what you want — a portfolio, a SaaS landing page, a dashboard — and it plans the whole structure for you." },
    { icon: Layers, title: "Smart file planning", desc: "The AI breaks your idea into clean, sensible components instead of one giant tangled file." },
    { icon: Eye, title: "Live preview, instantly", desc: "Watch your site render in real time as it's generated, powered by an in-browser sandbox — no setup required." },
    { icon: Code2, title: "Full code access", desc: "Every generated file is yours to read, edit, and understand — nothing is hidden behind a black box." },
    { icon: MessageSquare, title: "Conversational edits", desc: "Don't like something? Just ask for a change in chat and watch your project update live." },
    { icon: Download, title: "Export anytime", desc: "Download your project as a ready-to-run Vite + React + Tailwind codebase whenever you want." },
    { icon: Globe2, title: "One-click publish", desc: "Share a live, public link to your generated site the moment it's ready." },
    { icon: Palette, title: "Styled with Tailwind", desc: "Every project comes out clean, responsive, and using modern utility-first CSS by default." },
  ]

  const steps = [
    { num: "01", title: "Describe your idea", desc: "Type what you want to build in the prompt box — as simple or as detailed as you like." },
    { num: "02", title: "AI plans & builds", desc: "Builder AI plans the file structure, then writes each component with real, working functionality." },
    { num: "03", title: "Preview & refine", desc: "Watch it come together live, then chat with the AI to tweak anything that's not quite right." },
    { num: "04", title: "Download or publish", desc: "Export the full codebase, or publish instantly to a shareable link." },
  ]

  const stack = ["React", "Tailwind CSS", "Vite", "Sandpack", "Node.js", "MongoDB", "Express"]

  const testimonials = [
    { name: "Priya S.", role: "Hackathon participant", quote: "Went from a blank prompt to a working demo in less time than it took my teammates to set up their dev environment." },
    { name: "Dev R.", role: "Indie hacker", quote: "The fact that I can actually read and edit the generated code is what sold me. It doesn't feel like a black box." },
    { name: "Aisha K.", role: "Design student", quote: "I'm not a developer, but I described my portfolio idea and got something I could actually ship." },
  ]

  const faqs = [
    { q: "Do I need to know how to code?", a: "No. You can describe your idea in plain English and get a working site. But if you do know code, you get full access to edit everything." },
    { q: "Can I edit the generated code myself?", a: "Yes — every file is yours. Open the Files tab in the builder to view or edit anything directly." },
    { q: "What happens if I ask for a change?", a: "Use the chat panel to describe what you want changed. Builder AI revises only the relevant files and updates your live preview." },
    { q: "Can I download my project?", a: "Yes, any time. Use the Download button to export a ready-to-run Vite + React + Tailwind codebase." },
    { q: "Is my project private by default?", a: "Yes. Projects are only visible to you unless you explicitly publish them to a public link." },
  ]

  const audiences = [
    { icon: GraduationCap, title: "Students", desc: "Build class projects and demos fast, without getting stuck on setup instead of learning." },
    { icon: Briefcase, title: "Indie hackers", desc: "Validate an idea with a real working prototype before committing weeks to it." },
    { icon: Users, title: "Hackathon teams", desc: "Get a working base in minutes so your team spends the weekend building the interesting parts." },
    { icon: Lightbulb, title: "Non-coders", desc: "Turn an idea into something real without needing to learn a framework first." },
  ]

  const comparison = [
    { label: "Time to first working version", manual: "Hours to days", builder: "Minutes" },
    { label: "Boilerplate setup", manual: "Manual, every time", builder: "Handled automatically" },
    { label: "Code ownership", manual: "Full, from scratch", builder: "Full, generated for you" },
    { label: "Making changes", manual: "Edit code directly", builder: "Chat, or edit code directly" },
    { label: "Design decisions", manual: "All on you", builder: "Sensible defaults, fully editable" },
  ]

  const roadmap = [
    { status: "done", title: "Core generation engine", desc: "Prompt-to-file-structure planning and parallel file generation." },
    { status: "done", title: "Live chat revisions", desc: "Follow-up edits applied directly to existing project files." },
    { status: "current", title: "One-click publish", desc: "Public shareable links for finished projects." },
    { status: "upcoming", title: "Team collaboration", desc: "Multiple people editing and chatting on the same project." },
    { status: "upcoming", title: "Custom component library", desc: "Reusable design systems across your generated projects." },
  ]

  return (
    <main className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      {/* scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-zinc-500 via-white to-zinc-500 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ambient background, matching the rest of the app — now parallax-driven */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-zinc-900 to-black pointer-events-none" />

      <div ref={blob1Ref} className="fixed -top-24 -left-20 pointer-events-none">
        <div className="w-80 h-80 bg-zinc-700/20 rounded-full blur-3xl animate-float-slow" />
      </div>
      <div ref={blob2Ref} className="fixed top-1/3 -right-24 pointer-events-none">
        <div className="w-96 h-96 bg-zinc-600/15 rounded-full blur-3xl animate-float-slower" />
      </div>
      <div ref={blob3Ref} className="fixed bottom-0 left-1/4 pointer-events-none">
        <div className="w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float-medium" />
      </div>

      <div
        className="fixed inset-0 opacity-[0.035] animate-grid-shift pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <svg className="fixed top-16 right-1/4 w-24 h-24 opacity-[0.07] animate-spin-slow pointer-events-none" viewBox="0 0 100 100">
        <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="white" strokeWidth="1" />
      </svg>
      <svg className="fixed bottom-24 left-1/5 w-16 h-16 opacity-[0.06] animate-spin-reverse pointer-events-none" viewBox="0 0 100 100">
        <rect x="15" y="15" width="70" height="70" fill="none" stroke="white" strokeWidth="1" />
      </svg>

      {/* nav */}
      <nav className="sticky top-4 mx-4 md:mx-8 flex items-center justify-between rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] px-5 py-3 relative z-20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-header-in">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-2xl" />
        <Link
          to="/Homepage"
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>
      </nav>

      {/* hero */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-10 text-center">
        <Reveal variant="scale">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-6">
            <Sparkles size={11} />
            About the project
          </span>
        </Reveal>
        <Reveal delay={100} variant="blur">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            Build real websites{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500 animate-gradient-x">
              with a sentence
            </span>
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-zinc-400 leading-relaxed max-w-xl mx-auto">
            Builder AI turns a plain-English idea into a working, editable React website —
            planned, written, previewed, and ready to ship, all in one place.
          </p>
        </Reveal>
      </section>

      {/* 3D cube — reacts to scroll */}
      <section className="relative z-10 max-w-3xl mx-auto px-6">
        <ScrollCube />
      </section>

      {/* stats */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <Reveal variant="scale">
          <div className="grid grid-cols-3 gap-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6">
            {[
              { value: "5 min", label: "Idea to preview" },
              { value: "100%", label: "Editable code" },
              { value: "0", label: "Setup required" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <Reveal className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">What it can do</h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Everything you need to go from an idea to a real, working site.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 60} variant="scale">
              <div className="h-full rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 hover:bg-white/[0.07] hover:border-white/[0.14] hover:-translate-y-1 transition-all duration-300 group">
                <div className="size-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <f.icon size={16} className="text-zinc-200" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3D ring divider */}
      <section className="relative z-10 max-w-3xl mx-auto px-6">
        <ScrollRing />
      </section>

      {/* why I built this */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <ScrollTiltCard>
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-4">Why I built this</h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              I kept noticing the same gap: a great idea for a site or app, and hours lost to
              boilerplate before anything real was on screen. Builder AI exists to close that gap —
              not by hiding the code from you, but by getting you to a working starting point fast,
              with every file still fully yours to read and change.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              It's built for hackathons, prototypes, and anyone who'd rather describe what they want
              than wire up a project from scratch every single time.
            </p>
          </div>
        </ScrollTiltCard>
      </section>

      {/* who it's for */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <Reveal className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Who it's for</h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            If you've ever had an idea but didn't want to fight boilerplate first, this is for you.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {audiences.map((a, i) => (
            <Reveal key={i} delay={i * 70} variant="scale">
              <div className="h-full rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 text-center hover:bg-white/[0.07] transition-all duration-300">
                <div className="size-10 mx-auto rounded-full bg-white/10 border border-white/10 flex items-center justify-center mb-4">
                  <a.icon size={17} className="text-zinc-200" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{a.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{a.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <Reveal className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">How it works</h2>
          <p className="text-zinc-500 text-sm">Four steps, start to finish.</p>
        </Reveal>

        <div className="space-y-4">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 80} variant={i % 2 === 0 ? "left" : "right"}>
              <div className="flex items-start gap-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 hover:bg-white/[0.05] transition-all duration-300">
                <span className="text-2xl font-bold text-zinc-700 shrink-0 w-10">{s.num}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{s.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* comparison table */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <Reveal className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Builder AI vs. coding from scratch</h2>
          <p className="text-zinc-500 text-sm">The same result, a very different path to get there.</p>
        </Reveal>

        <Reveal variant="scale">
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
            <div className="grid grid-cols-3 text-xs font-medium text-zinc-400 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="p-4">&nbsp;</div>
              <div className="p-4 flex items-center gap-1.5"><X size={12} className="text-zinc-500" /> From scratch</div>
              <div className="p-4 flex items-center gap-1.5 text-white"><Check size={12} className="text-white" /> Builder AI</div>
            </div>
            {comparison.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 text-xs ${i !== comparison.length - 1 ? "border-b border-white/[0.06]" : ""}`}
              >
                <div className="p-4 text-zinc-400 font-medium">{row.label}</div>
                <div className="p-4 text-zinc-500">{row.manual}</div>
                <div className="p-4 text-zinc-200">{row.builder}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* testimonials */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <Reveal className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">What people say</h2>
          <p className="text-zinc-500 text-sm">A few words from people who've tried it.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 100} variant="scale">
              <div className="h-full rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 flex flex-col">
                <Quote size={16} className="text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-300 leading-relaxed mb-4 flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={11} className="text-zinc-400 fill-zinc-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-500">
                  <span className="text-white font-medium">{t.name}</span> · {t.role}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* roadmap */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <Reveal className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
            <Map size={18} className="text-zinc-400" />
            Roadmap
          </h2>
          <p className="text-zinc-500 text-sm">What's shipped, and what's next.</p>
        </Reveal>

        <div className="relative space-y-4 pl-6 border-l border-white/[0.08]">
          {roadmap.map((r, i) => (
            <Reveal key={i} delay={i * 70} variant="left">
              <div className="relative">
                <span
                  className={`absolute -left-[31px] top-1.5 size-2.5 rounded-full border-2 ${
                    r.status === "done"
                      ? "bg-white border-white"
                      : r.status === "current"
                      ? "bg-zinc-400 border-zinc-400 animate-pulse"
                      : "bg-transparent border-zinc-600"
                  }`}
                />
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 hover:bg-white/[0.05] transition-all duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white">{r.title}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        r.status === "done"
                          ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                          : r.status === "current"
                          ? "text-amber-400 border-amber-500/20 bg-amber-500/10"
                          : "text-zinc-500 border-white/10 bg-white/5"
                      }`}
                    >
                      {r.status === "done" ? "Shipped" : r.status === "current" ? "In progress" : "Planned"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* tech stack */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <Reveal>
          <h2 className="text-xl font-semibold mb-6 flex items-center justify-center gap-2">
            <Zap size={16} className="text-zinc-400" />
            Built on
          </h2>
        </Reveal>
        <Reveal delay={100} variant="scale">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {stack.map((tech, i) => (
              <span
                key={i}
                className="text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <Reveal className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
            <HelpCircle size={20} className="text-zinc-400" />
            Frequently asked
          </h2>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 60}>
              <details className="group rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer">
                <summary className="text-sm font-medium text-white flex items-center justify-between list-none">
                  {f.q}
                  <span className="text-zinc-500 group-open:rotate-45 transition-transform duration-200 text-lg leading-none">+</span>
                </summary>
                <p className="text-xs text-zinc-500 leading-relaxed mt-3">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-2xl mx-auto px-6 pb-24 text-center">
        <Reveal variant="scale">
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-10">
            <Rocket size={22} className="text-zinc-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Ready to build something?</h2>
            <p className="text-sm text-zinc-500 mb-6">Describe your idea and see it come to life in minutes.</p>
            <Link
              to="/Homepage"
              className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-lg px-5 py-2.5 hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Sparkles size={14} />
              Start building
            </Link>
          </div>
        </Reveal>
      </section>

      {/* feedback form */}
      <section className="relative z-10 max-w-2xl mx-auto px-6 pb-24">
        <Reveal variant="blur">
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-8 md:p-10">
            <div className="text-center mb-8">
              <Mail size={20} className="text-zinc-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold mb-2">Got feedback?</h2>
              <p className="text-sm text-zinc-500">
                Tell me what worked, what didn't, or what you'd like to see next.
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={feedbackForm.name}
                  onChange={handleFeedbackChange("name")}
                  className="bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/30 focus:ring-4 focus:ring-white/5 transition-all duration-300"
                />
                <input
                  type="email"
                  placeholder="Your email (optional)"
                  value={feedbackForm.email}
                  onChange={handleFeedbackChange("email")}
                  className="bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/30 focus:ring-4 focus:ring-white/5 transition-all duration-300"
                />
              </div>
              <textarea
                placeholder="Your feedback..."
                rows={4}
                value={feedbackForm.message}
                onChange={handleFeedbackChange("message")}
                className="bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/30 focus:ring-4 focus:ring-white/5 transition-all duration-300 resize-none"
              />
              <button
                type="submit"
                disabled={feedbackSubmitting}
                className="self-center flex items-center gap-2 bg-white text-black text-sm font-medium rounded-lg px-5 py-2.5 mt-1 hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              >
                {feedbackSubmitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {feedbackSubmitting ? "Sending..." : "Send feedback"}
              </button>
            </form>
          </div>
        </Reveal>
      </section>

      {/* license / footer */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-white/[0.02]">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <Reveal>
            <div className="flex items-center gap-2 mb-6">
              <FileCode size={15} className="text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">License</h2>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 mb-8">
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                This website was built by <span className="text-white font-medium">Harsh Chotaliya</span>.
              </p>
              <div className="text-xs text-zinc-500 leading-relaxed font-mono bg-black/40 border border-white/[0.06] rounded-xl p-4 space-y-2">
                <p>MIT License</p>
                <p>Copyright © {new Date().getFullYear()} Harsh Chotaliya</p>
                <p className="pt-2">
                  Permission is hereby granted, free of charge, to any person obtaining a copy
                  of this software and associated documentation files, to deal in the software
                  without restriction, including without limitation the rights to use, copy,
                  modify, merge, publish, distribute, sublicense, and/or sell copies of the
                  software, subject to the following conditions:
                </p>
                <p>
                  The above copyright notice and this permission notice shall be included in
                  all copies or substantial portions of the software.
                </p>
                <p>
                  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                  SOFTWARE.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              <a
                href="mailto:harshchotaliya37@gmail.com"
                className="flex items-center gap-1.5 hover:text-white transition-colors duration-200"
              >
                <Mail size={12} />
                harshchotaliya37@gmail.com
              </a>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-1.5">
                <Phone size={12} />
                +91 90169 79983
              </span>
              <span className="text-zinc-700">•</span>
              <span>Builder AI © {new Date().getFullYear()}</span>
            </div>
          </Reveal>
        </div>
      </footer>

      {/* scroll to top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 size-11 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        title="Back to top"
      >
        <ArrowUp size={16} />
      </button>

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
        @keyframes grid-shift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes header-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 13s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 11s ease-in-out infinite; }
        .animate-grid-shift { animation: grid-shift 8s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 22s linear infinite; transform-origin: center; }
        .animate-spin-reverse { animation: spin-reverse 28s linear infinite; transform-origin: center; }
        .animate-gradient-x { background-size: 200% auto; animation: gradient-x 4s ease-in-out infinite; }
        .animate-header-in { animation: header-in 0.4s ease-out forwards; }
      `}</style>
    </main>
  )
}

export default HandleAbout