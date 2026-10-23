import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import debounce from 'lodash.debounce'
import api from '../API/api'
import toast from 'react-hot-toast'

const AppContext = createContext(undefined)

export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const navigate = useNavigate()

  // project state
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [activeProject, setActiveProject] = useState(null)
  const [loadingActiveProject, setLoadingActiveProject] = useState(true)
  const [chatLoading, setChatLoading] = useState(false)
  const [generatingProject, setGeneratingProject] = useState(null)
  const [activeFile, setActiveFile] = useState("/App.jsx")
  const [showCode, setShowCode] = useState(false)

  const checkSession = useCallback(async () => {
    try {
      const { data } = await api.get('/api/auth/me')
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoadingUser(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      setUser(data.user)
      toast.success('Login successful')
      navigate('/')
    } catch (error) {
      console.error("Login failed:", error)
      const errormsg = error.response?.data?.message || "Invalid email or password"
      toast.error(errormsg)
      throw new Error(errormsg)
    }
  }

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password })
      toast.success('Account created successfully')
      return data
    } catch (error) {
      console.error("Registration failed:", error)
      const errormsg = error.response?.data?.message || "Something went wrong during registration"
      toast.error(errormsg)
      throw new Error(errormsg)
    }
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
      setUser(null)
      toast.success('Logged out')
      navigate('/login')
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Something went wrong")
    }
  }

  // ---- project actions ----

  const loadProjects = useCallback(async () => {
    if (!user) return
    setLoadingProjects(true)
    try {
      const { data } = await api.get('/api/projects')
      setProjects(data)
    } catch (error) {
      console.error("Loading projects failed:", error)
      toast.error("Couldn't load your projects")
    } finally {
      setLoadingProjects(false)
    }
  }, [user])

  const loadProject = useCallback(async (id, silent = false) => {
    if (!user) return
    if (!silent) setLoadingActiveProject(true)

    try {
      const { data } = await api.get(`/api/projects/${id}`)
      setActiveProject(data)

      const files = Object.keys(data.files || {})
      if (files.length > 0) {
        setActiveFile((prev) => {
          if (files.includes(prev)) return prev
          if (files.includes("/App.jsx")) return "/App.jsx"
          return files[0]
        })
      }
    } catch (error) {
      console.error("Loading project failed:", error)
      if (!silent) {
        toast.error("Failed to load project details")
        navigate("/")
      }
    } finally {
      if (!silent) setLoadingActiveProject(false)
    }
  }, [user, navigate])

  const createProject = async (prompt) => {
    try {
      const { data } = await api.post('/api/projects', { prompt })
      setProjects((prev) => [data, ...prev])
      toast.success('Project created')
      navigate(`/Builderpage/${data._id}`)
      return data
    } catch (error) {
      console.error("Creating project failed:", error)
      const errormsg = error.response?.data?.message || "Couldn't create your project"
      toast.error(errormsg)
      throw new Error(errormsg)
    }
  }

  const deleteProject = async (projectId) => {
    try {
      await api.delete(`/api/projects/${projectId}`)
      setProjects((prev) => prev.filter((p) => p._id !== projectId))
      toast.success('Project deleted')
    } catch (error) {
      console.error("Deleting project failed:", error)
      toast.error("Couldn't delete this project")
    }
  }

  const renameProject = async (projectId, name) => {
    try {
      const { data } = await api.patch(`/api/projects/${projectId}`, { name })
      setProjects((prev) => prev.map((p) => (p._id === projectId ? data : p)))
      toast.success('Project renamed')
    } catch (error) {
      console.error("Renaming project failed:", error)
      toast.error("Couldn't rename this project")
    }
  }

  // automatically re-poll the active project while it's generating/pending
  useEffect(() => {
    if (!activeProject) return
    if (activeProject.status !== "generating" && activeProject.status !== "pending") return

    const interval = setInterval(() => {
      loadProject(activeProject._id, true)
    }, 3000)

    return () => clearInterval(interval)
  }, [activeProject, loadProject])

  // ---- live file autosave (debounced) ----

  const debounceSave = useMemo(
    () =>
      debounce(async (files, id) => {
        try {
          await api.put(`/api/projects/${id}/files`, { files })
        } catch (error) {
          console.error("Auto-save failed:", error)
          toast.error("Auto-save failed, try again")
        }
      }, 800),
    []
  )

  // inside AppContextProvider
  const handleAbout = () => {
                                 // 👇 choose the route you want
  navigate("/handleabout");        // goes to Homepage
                    // navigate("/Builderpage/123"); // example dynamic route
               // navigate("/publish/456");     // example publish page
  };


  useEffect(() => {
    return () => {
      debounceSave.flush()
    }
  }, [debounceSave])

  const updateProjectFile = useCallback(
    (files) => {
      if (!activeProject || !user) return
      debounceSave(files, activeProject._id)
    },
    [activeProject, user, debounceSave]
  )

  return (
    <AppContext.Provider
      value={{
        user,
        loadingUser,
        login,
        register,
        logout,
        projects,
        loadingProjects,
        loadProjects,
        activeProject,
        loadingActiveProject,
        loadProject,
        createProject,
        deleteProject,
        renameProject,
        chatLoading,
        setChatLoading,
        generatingProject,
        setGeneratingProject,
        activeFile,
        setActiveFile,
        showCode,
        setShowCode,
        updateProjectFile,
        handleAbout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error('useAppContext must be used inside AppContextProvider')
  }

  return context
}