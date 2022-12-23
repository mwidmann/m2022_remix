import { createCookie } from "@remix-run/node";

export const settings = createCookie(`settings`, {
  maxAge: 60 * 60 * 24 * 365,
})
