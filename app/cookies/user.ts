import { createCookie } from 'remix'

export const user = createCookie(`user`, {
  maxAge: 60 * 60 * 24 * 365
})