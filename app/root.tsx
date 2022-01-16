import {
  Links,
  LiveReload,
  ScrollRestoration,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";
import { useRef, useEffect, useState } from "react";
import styles from "./tailwind.css";
import { darkMode } from "./cookies/darkMode";
import { user } from "./cookies/user";
import { AppContext } from "./context/AppContext";
import { Board, UserData } from '~/types'
import Header from '~/components/Header'

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => {
  return { title: "m!2022" };
};

type LoaderData = {
  darkMode: boolean | undefined,
  data: { boards: Board[], pms?: number }
  userData: undefined | UserData
}

export async function loader({ request }: { request: Request }): Promise<LoaderData> {
  const cookieHeader = request.headers.get("Cookie")
  const darkModeCookie = await darkMode.parse(cookieHeader) || {}
  darkModeCookie.darkMode !== undefined
  const userData = await user.parse(cookieHeader) || ``

  const response = await fetch(`${process.env.LOCAL_SERVER ?? `http://localhost:3000`}/api/boards`, {
    headers: {
      Cookie: await user.serialize(userData)
    }
  })
  const data = await response.json()

  return {
    darkMode: darkModeCookie?.darkMode !== undefined ? darkModeCookie.darkMode : undefined,
    data,
    userData
  }
}

export default function App() {
  const body = useRef<HTMLBodyElement>(null)
  const { darkMode, data, userData } = useLoaderData<LoaderData>()
  const [useDarkMode, setUseDarkMode] = useState<boolean>(darkMode !== undefined ? darkMode : false)
  const [currentUser, setCurrentUser] = useState<undefined | UserData>(userData)

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
      <body ref={body} className={`antialiased ${useDarkMode ? `dark` : ``}`}>
        <AppContext.Provider value={{ darkMode: useDarkMode, setUseDarkMode, currentUser, setCurrentUser, pms: data.pms }}>
          <div className="flex w-screen h-screen flex-col">
            <div className="flex-grow-0 flex-shrink-0">
              <Header boards={data.boards} />
            </div>

            <Outlet />
          </div >
        </AppContext.Provider>
        <Scripts />
        <ScrollRestoration />
        {process.env.NODE_ENV === "development" && <LiveReload />}
        <script src="/lib/swiped-events.js" />
      </body>
    </html>
  );
}
