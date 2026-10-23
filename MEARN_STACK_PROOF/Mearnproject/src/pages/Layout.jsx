import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppContext } from '../Context/App-context'
import Loading from '../Componets/Loading'

export function Authlayout() {
  const { user, loadingUser } = useAppContext()

  if (loadingUser) return <Loading />
  if (!user) return <Navigate to="/login" replace />

  return (
    <div>
      <Outlet />
    </div>
  )
}

export function Guestlayout() {
  const { user, loadingUser } = useAppContext()

  if (loadingUser) return <Loading />
  if (user) return <Navigate to="/Homepage" replace />   // ✅ send logged-in users to Homepage instead of "/"

  return (
    <div>
      <Outlet />
    </div>
  )
}
