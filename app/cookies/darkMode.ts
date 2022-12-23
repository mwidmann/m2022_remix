import { createCookie } from "@remix-run/node";

export const darkMode = createCookie(`dark-mode`, {
  maxAge: 60 * 60 * 24 * 365
})