import { AppContext } from '~/context/AppContext'
import { useContext, useState, useEffect, useRef } from 'react'
import { Switch } from '@headlessui/react'
import { Form, useSubmit, useLoaderData, useActionData } from '@remix-run/react'
import { redirect, LoaderFunction } from '@remix-run/node'
import { darkMode } from '~/cookies/darkMode'
import { user } from '~/cookies/user'
import CurrentUser from '~/components/CurrentUser'
import { fetchUserProfileById } from '~/api'
import { UserProfile } from '~/types'

export async function action({ request }: { request: Request }) {
  const form = await request.formData()
  const cookieHeader = request.headers.get('Cookie')

  switch (form.get(`_action`)) {
    case 'setDarkMode':
      const useDarkMode = form.get('dark-mode') === '1'
      const darkModeCookie = (await darkMode.parse(cookieHeader)) || {}
      darkModeCookie.darkMode = useDarkMode
      return redirect('/settings', {
        headers: {
          'Set-Cookie': await darkMode.serialize(darkModeCookie),
        },
      })
    case 'login':
      const nick = form.get('nick')
      const pass = form.get('pass')

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

        return redirect('/settings', {
          headers: {
            'Set-Cookie': await user.serialize({ userid, username, cookie }),
          },
        })
      } else {
        const match = data.match(/fehler \d+: (.*)<\/td>/m)
        return { error: match ? match[1] : `Unbekannter Fehler beim Login` }
      }
      break
    case 'logout':
      return redirect(`/settings`, {
        headers: {
          'Set-Cookie': await user.serialize(``, {
            expires: new Date(1970, 1, 1),
          }),
        },
      })
  }
  return null
}

export const loader: LoaderFunction = async (context) => {
  const cookieHeader = context.request.headers.get('Cookie')
  const userData = (await user.parse(cookieHeader)) || undefined

  let userProfile: undefined | UserProfile = undefined
  if (userData && userData.userid) {
    userProfile = (await fetchUserProfileById(userData.userid)) as UserProfile
  }

  return { userData, userProfile }
}

export default function SettingsIndex() {
  const darkModeForm = useRef<HTMLFormElement>(null)
  const context = useContext(AppContext)
  const submit = useSubmit()
  const [enabled, setEnabled] = useState<boolean>(false)
  const { userData, userProfile } = useLoaderData()
  const actionData = useActionData()
  useEffect(() => {
    setEnabled(context.darkMode)
    context.setCurrentUser(userData)
  }, [context])

  const toggleDarkMode = () => {
    setEnabled(!enabled)
    context.setUseDarkMode(!enabled)
    submit(darkModeForm.current, { replace: true })
  }

  return (
    <div className="h-full overflow-hidden overflow-y-auto p-2 text-gray-900 dark:text-gray-100 lg:px-4">
      {context.currentUser ? (
        <CurrentUser user={{ ...userProfile, ...context.currentUser }} />
      ) : (
        <div>
          <p className="font-medium">
            Du bist nicht eingeloggt. Bestimmte Features (posten, antworten,
            PMs) stehen nur für eingeloggte User zur Verfügung.
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

      <Form method="post" replace ref={darkModeForm} className="mt-8">
        <input type="hidden" name="_action" value="setDarkMode" />
        <input type="hidden" name="dark-mode" value={enabled ? '0' : '1'} />
        <Switch.Group>
          <div className="flex items-center justify-between">
            <Switch.Label className="font-medium">Dark Mode</Switch.Label>
            <Switch
              type="submit"
              checked={enabled}
              onChange={toggleDarkMode}
              className={`${
                enabled ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </Switch.Group>
      </Form>
    </div>
  )
}
