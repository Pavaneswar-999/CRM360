import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react'
import { api, request, setAccessToken } from './api'
import type { User } from './types'

type AuthContextValue = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; register: (name: string, email: string, password: string) => Promise<void>; logout: () => void; refresh: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | null>(null)
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true)
  const refresh = async () => { try { const data = await request<{ user: User; token: string }>(api.post('/auth/refresh')); setAccessToken(data.token); setUser(data.user) } catch { setAccessToken(null); setUser(null) } finally { setLoading(false) } }
  useEffect(() => { void refresh() }, [])
  const login = async (email: string, password: string) => { const data = await request<{ user: User; token: string }>(api.post('/auth/login', { email, password })); setAccessToken(data.token); setUser(data.user) }
  const register = async (name: string, email: string, password: string) => { const data = await request<{ user: User; token: string }>(api.post('/auth/register', { name, email, password })); setAccessToken(data.token); setUser(data.user) }
  const logout = () => { void api.post('/auth/logout').catch(() => undefined); setAccessToken(null); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</AuthContext.Provider>
}
export const useAuth = () => { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value }
