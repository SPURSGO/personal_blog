import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const location = useLocation()
  const [checking, setChecking] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthed(!!session)
      setChecking(false)
    }
    checkAuth()
  }, [])

  if (checking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">正在校验权限...</p>
        </div>
      </div>
    )
  }

  if (!isAuthed) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}

