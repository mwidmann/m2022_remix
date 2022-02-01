import { createContext } from 'react'
import { type AppState, UserData } from '~/types'

export const appState: AppState = {
  currentUser: undefined,
  setCurrentUser: (user: undefined | UserData) => {},
  pms: undefined,
  isMenuOpen: false,
  setMenuOpen: (value: boolean) => {},
  settings: {},
}

export const AppContext = createContext(appState)
