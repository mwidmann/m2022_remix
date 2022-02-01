export type Board = {
  id: number
  isOpen: boolean
  boardName: string
  boardDesc: string
  lastPost: string
}

export type Thread = {
  title: string
  id: number
  author: string
  date: string
  messages: number
  isFixed?: boolean
  hasNewMessages?: boolean
  lastReply?: string
}

export type ThreadMessage = {
  title: string
  hierarchy: number
  author: string
  id: number
  date: string
  ts: number
  tts: number
  children: ThreadMessage[]
}

export type PlainMessage = {
  title: string
  content: string
}

export type Message = PlainMessage & {
  author: string
  authorId: number
  date: string
  threadId?: number
}

export type UserData = {
  username: string
  userid: number
  cookie: string
}

export type AppState = {
  // darkMode: boolean
  currentUser: undefined | UserData
  setCurrentUser: (user: undefined | UserData) => void
  pms: undefined | number
  isMenuOpen: boolean
  setMenuOpen: (v: boolean) => void
  settings: Settings
}

export type BoardsResponse = {
  boards: Board[]
  pms: undefined | number
}

export type UserProfile = {
  [key: string]: string
}

export type SettingsItem = {
  label: string
  name: string
  description?: string
  values: string[]
  current: string
  icons: JSX.Element[]
}

export enum DisplayModes {
  frames = '3-Frame-Darstellung',
  inline = 'Inline-Darstellung',
}

export enum SortorderModes {
  default = 'Standard',
  newest = 'Neueste Äste zuerst',
}

export enum Logo {
  new = 'new',
  old = 'old',
}

export type Settings = {
  theme?: 'dark' | 'light' | 'neon'
  displayMode?: DisplayModes
  sortOrder?: SortorderModes
  logo?: Logo
}
