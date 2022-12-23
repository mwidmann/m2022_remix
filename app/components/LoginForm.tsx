import { useFetcher } from "@remix-run/react";
export default function LoginForm() {
  const fetcher = useFetcher()
  const actionData = fetcher.data

  return (
    <div>
      <p className="font-medium">
        Du bist nicht eingeloggt. Bestimmte Features (posten, antworten, PMs)
        stehen nur für eingeloggte User zur Verfügung.
      </p>
      {actionData && actionData.error ? (
        <div className="mt-4 font-medium text-red-600 dark:text-red-400">
          {actionData.error}
        </div>
      ) : null}
      <fetcher.Form method="post" action="/api/settings" className="mt-4">
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 neon:bg-neonb-900 dark:bg-slate-900 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 neon:bg-neonb-900 dark:bg-slate-900 sm:text-sm"
            required
            placeholder="password"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" className="action-button">
            Login
          </button>
        </div>
      </fetcher.Form>
    </div>
  )
}
