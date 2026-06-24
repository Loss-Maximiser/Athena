import { createContext, useContext, useState, useEffect } from 'react'
import { api } from './api'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading

  useEffect(() => {
    api.me()
      .then(u => setUser(u || null))
      .catch(() => setUser(null))
  }, [])

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}
