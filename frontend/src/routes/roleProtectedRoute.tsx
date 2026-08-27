import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

type RoleProtectedRouteProps = {
  children: ReactNode
  allowedRoles: string[]
}

const getUserRole = (): string | null => localStorage.getItem('healthra-role')

export const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const role = getUserRole()

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
