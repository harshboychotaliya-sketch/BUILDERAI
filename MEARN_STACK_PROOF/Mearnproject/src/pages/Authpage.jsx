import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Leftside from '../Componets/Leftside'
import { useAppContext } from '../Context/App-context'

const Authpage = ({ mode }) => {
  const isLogin = mode === "login"
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, register } = useAppContext()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(name, email, password)
        navigate("/login")
      }
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex text-zinc-900 font-sans">
      {/* left side */}
      <Leftside />

      {/* right side */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

        {/* faint drifting grid, matches left panel */}
        <div
          className="absolute inset-0 opacity-[0.035] animate-grid-shift pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* soft glow blob top right */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-zinc-200/50 rounded-full blur-3xl animate-float-slow pointer-events-none" />

        <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
          <h1 className="text-2xl font-bold mb-1 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-zinc-500 mb-8 animate-fade-in-up" style={{ animationDelay: "60ms" }}>
            {isLogin
              ? "Log in to continue building."
              : "Sign up to start building your website."}
          </p>

          {error && (
            <p className="text-red-500 mb-4 animate-shake">{error}</p>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-zinc-300 rounded-lg px-4 py-2.5 outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: "120ms" }}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-zinc-300 rounded-lg px-4 py-2.5 outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: "160ms" }}
            />
            <div className="relative animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="border border-zinc-300 rounded-lg px-4 py-2.5 outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all duration-300 w-full"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 transition-colors duration-200 focus:outline-none"
              >
                {showPassword ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-zinc-900 text-white rounded-lg py-2.5 mt-2 hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 animate-fade-in-up relative overflow-hidden group"
              style={{ animationDelay: "240ms" }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {loading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </button>
          </form>

          <p
            className="text-sm text-zinc-500 mt-6 text-center animate-fade-in-up"
            style={{ animationDelay: "280ms" }}
          >
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <Link to="/register" className="text-zinc-900 font-bold hover:underline underline-offset-2">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-zinc-900 font-bold hover:underline underline-offset-2">
                  Log in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes grid-shift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 25px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }

        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-grid-shift { animation: grid-shift 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  )
}

export default Authpage