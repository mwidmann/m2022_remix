import { createCookie } from 'remix'

export const settings = createCookie(`settings`, {
  maxAge: 60 * 60 * 24 * 365,
})
