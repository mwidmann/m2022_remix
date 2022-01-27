import {
  Links,
  LiveReload,
  ScrollRestoration,
  Meta,
  Outlet,
  Scripts,
  useActionData,
  useLoaderData,
  Form,
  redirect,
} from 'remix'
import type { MetaFunction, LoaderFunction, ActionFunction } from 'remix'
import { useRef, useEffect, useState } from 'react'
import { fetchBoards } from './api'
import { darkMode } from './cookies/darkMode'
import { user } from './cookies/user'
import { AppContext } from './context/AppContext'
import { Board, UserData } from '~/types'
import Header from '~/components/Header'
import CurrentUser from '~/components/CurrentUser'

import styles from './tailwind.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

export const meta: MetaFunction = () => {
  return { title: 'm!2022' }
}

type LoaderData = {
  darkMode: boolean | undefined
  data: { boards: Board[]; pms?: number }
  userData: undefined | UserData
}

export const loader: LoaderFunction = async (context): Promise<LoaderData> => {
  const cookieHeader = context.request.headers.get('Cookie')
  const darkModeCookie = (await darkMode.parse(cookieHeader)) || {}
  darkModeCookie.darkMode !== undefined
  const userData = (await user.parse(cookieHeader)) || ``
  const data = await fetchBoards(context)

  return {
    darkMode:
      darkModeCookie?.darkMode !== undefined
        ? darkModeCookie.darkMode
        : undefined,
    data,
    userData,
  }
}

export async function action({ request }: { request: Request }) {
  const form = await request.formData()
  const cookieHeader = request.headers.get('Cookie')
  switch (form.get(`_action`)) {
    case 'login':
      const formData = [
        `nick=${encodeURIComponent(form.get('nick') as string)}`,
        `pass=${encodeURIComponent(form.get('pass') as string)}`,
        `mode=login`,
        `brdid=`,
      ]

      const response = await fetch(
        `https://maniac-forum.de/forum/pxmboard.php`,
        {
          method: 'post',
          headers: { 'Content-type': `application/x-www-form-urlencoded` },
          body: formData.join(`&`),
        }
      )
      const headers = response.headers
      const data = await response.text()

      const match = data.match(
        /<div>id: (\d+)<\/div>\s+<div>nickname: (.*)<\/div>/m
      )
      if (match) {
        const userid = match[1]
        const username = match[2]
        const cookie = headers.get('set-cookie')

        const currentUser = { userid, username, cookie }

        return redirect(`/`, {
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': await user.serialize({ userid, username, cookie }),
          },
        })
      } else {
        const match = data.match(/fehler \d+: (.*)<\/td>/m)
        return { error: match ? match[1] : `Unbekannter Fehler beim Login` }
      }
      break
    case 'logout':
      return redirect(`/`, {
        headers: {
          'Set-Cookie': await user.serialize(``, {
            expires: new Date(1970, 1, 1),
          }),
        },
      })
  }
  return null
}

export default function App() {
  const body = useRef<HTMLBodyElement>(null)
  const { darkMode, data, userData } = useLoaderData<LoaderData>()
  const actionData = useActionData()
  const [useDarkMode, setUseDarkMode] = useState<boolean>(
    darkMode !== undefined ? darkMode : false
  )
  const [currentUser, setCurrentUser] = useState<undefined | UserData>(userData)
  const [isMenuOpen, setMenuOpen] = useState<boolean>(true)

  useEffect(() => {
    setCurrentUser(userData)
  }, [userData])

  useEffect(() => {
    if (darkMode === undefined) {
      setUseDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    if (useDarkMode) {
      body.current?.classList.add('dark')
    } else {
      body.current?.classList.remove('dark')
    }
  }, [body.current])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        ref={body}
        className={`relative antialiased ${
          useDarkMode
            ? `dark bg-slate-900 text-gray-100`
            : `bg-gray-50/50 text-slate-900`
        }`}
      >
        <AppContext.Provider
          value={{
            darkMode: useDarkMode,
            setUseDarkMode,
            isMenuOpen,
            setMenuOpen,
            currentUser,
            setCurrentUser,
            pms: data.pms,
          }}
        >
          <div className="flex h-screen w-screen flex-col">
            <div className="flex-shrink-0 flex-grow-0">
              <Header boards={data.boards} />
            </div>

            <div className="relative h-full flex-grow overflow-hidden">
              <Outlet />
              <div
                className={`absolute inset-0 transform-gpu bg-gray-50/50 filter backdrop-blur-sm transition-all duration-200 dark:bg-slate-900/50 ${
                  isMenuOpen
                    ? `z-20 scale-100 opacity-100`
                    : `scale-80 -z-10 opacity-0`
                }`}
              >
                <div className="flex h-full w-full items-start justify-end">
                  <div className="w-3/4 max-w-xs border border-slate-900 bg-gray-50/50 p-2 shadow-md dark:border-gray-100 dark:bg-slate-900 md:p-4 lg:max-w-md">
                    {currentUser ? (
                      <CurrentUser user={currentUser} />
                    ) : (
                      <div>
                        <p className="font-medium">
                          Du bist nicht eingeloggt. Bestimmte Features (posten,
                          antworten, PMs) stehen nur für eingeloggte User zur
                          Verfügung.
                        </p>
                        {actionData && actionData.error ? (
                          <div className="mt-4 font-medium text-red-600 dark:text-red-400">
                            {actionData.error}
                          </div>
                        ) : null}
                        <Form method="post" replace className="mt-4">
                          <input type="hidden" name="_action" value="login" />
                          <div className="">
                            <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                              htmlFor="nick"
                            >
                              Nickname
                            </label>
                            <input
                              type="text"
                              name="nick"
                              id="nick"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-slate-900 sm:text-sm"
                              required
                              placeholder="Nickname"
                            />
                          </div>
                          <div className="mt-4">
                            <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                              htmlFor="pass"
                            >
                              Passwort
                            </label>
                            <input
                              type="password"
                              name="pass"
                              id="pass"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-slate-900 sm:text-sm"
                              required
                              placeholder="password"
                            />
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button type="submit" className="action-button">
                              Login
                            </button>
                          </div>
                        </Form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppContext.Provider>
        <Scripts />
        <ScrollRestoration />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
        <script src="/lib/swiped-events.js" />
      </body>
    </html>
  )
}
