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
}

export type Message = {
  title: string
  hierarchy: number
  author: string
  id: number
  date: string
}

export type ContextType = {
  board: number
  thread?: number
  message?: number
  user?: {
    username: string
    password: string
    cookie: string
  }
}