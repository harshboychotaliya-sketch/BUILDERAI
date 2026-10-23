import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../Componets/Loading'
import { AlertCircle } from 'lucide-react'
import FullPagePreview from '../Componets/fullpagepriview'
import api from '../API/api'
import toast from 'react-hot-toast'

const Priviwepage = () => {
  const { id } = useParams()
  const [project, setproject] = useState(null)
  const [loading, setloading] = useState(true)
  const [error, seterror] = useState("")

  useEffect(() => {
    if (!id) return        // jo id na hoy to ! use karvu

    const featchpublicproject = async () => {
      try {
        const { data } = await api.get(`/api/projects/${id}`)
        setproject(data)
      }
      catch (err) {
        console.log("Failed to load project :", err)
        seterror(err?.response?.data?.errror || "website is publish yet try again later")
        toast.error("failed to load project try again")
      }
      finally {
        setloading(false)
      }
    }
    featchpublicproject()
  }, [id])

  if (loading) {
    return (
      <Loading />
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="size-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <h1 className="text-lg font-semibold text-white">Website unavailable</h1>
        <p className="text-sm text-zinc-500">{error || "This website is not available"}</p>
        <div className="text-xs text-zinc-600 mt-4">Builder AI</div>
      </div>
    )
  }
  return (
    <FullPagePreview files={project.files} />
  )
}

export default Priviwepage