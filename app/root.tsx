import {
  Links,
  LiveReload,
  ScrollRestoration,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
} from 'remix'
import type { MetaFunction, LoaderFunction, ActionFunction } from 'remix'
import { useRef, useEffect, useState } from 'react'
import { fetchBoards } from './api'
import { settings } from './cookies/settings'
import { user } from './cookies/user'
import { AppContext } from './context/AppContext'
import { Board, UserData, Settings } from '~/types'
import Header from '~/components/Header'
import SettingsMenu from './components/SettingsMenu'

import styles from './tailwind.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

export const meta: MetaFunction = () => {
  return { title: 'm!2022' }
}

type LoaderData = {
  data: { boards: Board[]; pms?: number }
  userData: undefined | UserData
  settings: Settings
}

export const loader: LoaderFunction = async (context): Promise<LoaderData> => {
  const cookieHeader = context.request.headers.get('Cookie')
  const userData = (await user.parse(cookieHeader)) || ``
  if (userData && userData.userid) {
    userData.userid = parseInt(userData.userid, 10)
  }
  const settingsData = (await settings.parse(cookieHeader)) || {}
  const data = await fetchBoards(context)

  return {
    data,
    userData,
    settings: settingsData,
  }
}

export default function App() {
  const body = useRef<HTMLBodyElement>(null)
  const { settings, data, userData } = useLoaderData<LoaderData>()
  const [currentUser, setCurrentUser] = useState<undefined | UserData>(userData)
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    setCurrentUser(userData)
  }, [userData])

  useEffect(() => {
    if (settings.theme === undefined) {
      settings.theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }

    if (settings.theme === 'dark') {
      body.current?.classList.remove('neon')
      body.current?.classList.add('dark')
    } else if (settings.theme === 'light') {
      body.current?.classList.remove('dark', 'neon')
    } else if (settings.theme === 'neon') {
      body.current?.classList.remove('dark')
      body.current?.classList.add('neon')
    }
  }, [body.current, settings])

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
          settings.theme === `dark`
            ? `dark bg-slate-900 text-gray-100`
            : settings.theme === `neon`
            ? `neon bg-neonb-900 text-neonf-100`
            : `bg-gray-50 text-slate-900`
        }`}
      >
        <AppContext.Provider
          value={{
            // darkMode: useDarkMode,
            isMenuOpen,
            setMenuOpen,
            currentUser,
            setCurrentUser,
            pms: data.pms,
            settings,
          }}
        >
          <div className="flex h-screen w-screen flex-col">
            <div className="flex-shrink-0 flex-grow-0">
              <Header boards={data.boards} />
            </div>

            <div className="relative h-full flex-grow overflow-hidden">
              <SettingsMenu />
              <Outlet />
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
