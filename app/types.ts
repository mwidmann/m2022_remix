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
  messages: number,
  isFixed?: boolean
  hasNewMessages?: boolean
}

export type ThreadMessage = {
  title: string
  hierarchy: number
  author: string
  id: number
  date: string
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
  username: string,
  userid: number,
  cookie: string
}
export type AppState = {
  darkMode: boolean
  setUseDarkMode: (v: boolean) => void
  currentUser: undefined | UserData
  setCurrentUser: (user: undefined | UserData) => void
  pms: undefined | number
}

export type BoardsResponse = {
  boards: Board[]
  pms: undefined | number
}

export type UserProfileResponse = {
  [key: string]: string
}