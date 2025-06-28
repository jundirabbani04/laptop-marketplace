"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface AuthState {
  isAuthenticated: boolean
  user: { username: string } | null
}

interface AuthContextType {
  authState: AuthState
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  })

  // Check for existing session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("laptop-auth")
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        if (authData.isAuthenticated && authData.user) {
          setAuthState(authData)
        }
      } catch (error) {
        console.error("Error loading auth from localStorage:", error)
        localStorage.removeItem("laptop-auth")
      }
    }
  }, [])

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("laptop-auth", JSON.stringify(authState))
  }, [authState])

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const validUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin"
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

    if (username === validUsername && password === validPassword) {
      setAuthState({
        isAuthenticated: true,
        user: { username },
      })
      return true
    }
    return false
  }

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    })
    localStorage.removeItem("laptop-auth")
  }

  return <AuthContext.Provider value={{ authState, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
