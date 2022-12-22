import { useContext } from 'react'
import { useFetcher } from '@remix-run/react'
import { AppContext } from '~/context/AppContext'
import { UserData } from '~/types'

export default function CurrentUser({ user }: { user: UserData }) {
  const { pms } = useContext(AppContext)
  const userId = user.userid
  const fetcher = useFetcher()

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center space-x-2">
          <img
            className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-500 dark:ring-gray-300"
            src={`https://maniac-forum.de/forum/images/profile/${
              userId - (userId % 100)
            }/${userId}.jpg`}
          />
          <div className="font-bold">{user.username}</div>
        </div>
        <fetcher.Form method="post" action="/api/settings">
          <input type="hidden" name="_action" value="logout" />
          <button type="submit" className="action-button">
            Abmelden
          </button>
        </fetcher.Form>
      </div>
      {/* <p className="mt-4">
        Du hast
        <Link to={`/private-messages`}><b>{pms}</b> ungelesene PMs</Link>.
      </p> */}
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </div>
  )
}
