import { createCookie } from "@remix-run/node";

export const user = createCookie(`user`, {
  maxAge: 60 * 60 * 24 * 365
})