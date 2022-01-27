import { createContext } from 'react'
import { type AppState, UserData } from '~/types'

export const appState: AppState = {
  darkMode: false,
  setUseDarkMode: (value: boolean) => {},
  currentUser: undefined,
  setCurrentUser: (user: undefined | UserData) => {},
  pms: undefined,
  isMenuOpen: false,
  setMenuOpen: (value: boolean) => {},
}

export const AppContext = createContext(appState)
