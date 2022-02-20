import { Link, useTransition } from 'remix'
import { Thread } from '~/types'
import ThreadCount from './ThreadCount'

export default function SingleThread({
  thread,
  hasNewMessages,
  currentThread,
}: {
  thread: Thread
  hasNewMessages: boolean
  currentThread: number
}) {
  const transition = useTransition()
  const isLoading =
    transition.state === 'loading' &&
    transition.location?.pathname?.endsWith(`thread/${thread.id}`)
  const isCurrentClass =
    isLoading || currentThread === thread.id
      ? `bg-blue-200 dark:bg-slate-600 dark:text-gray-100 shadow-md neon:bg-neonb-500 neon:text-neonf-300 maniac:bg-maniac-bg maniac:text-maniac-link`
      : ``
  return (
    <li
      className={`border-b border-gray-700 dark:border-gray-500 ${isCurrentClass}`}
    >
      <Link
        to={`thread/${thread.id}`}
        className="w-full text-left text-sm text-gray-900 visited:text-gray-500 neon:text-neonf-100 maniac:text-maniac-link neon:visited:text-neonf-400 maniac:visited:text-maniac-linkv dark:text-gray-100 dark:visited:text-gray-100"
      >
        <div className="w-full p-2">
          <div className="flex justify-between">
            <p className="text-sm font-semibold md:text-base">{thread.title}</p>
          </div>
          <div className="flex w-full items-center justify-between text-xs text-gray-500 neon:text-neonf-900 maniac:text-black dark:text-gray-300">
            <div>
              von <span className="font-sm font-semibold">{thread.author}</span>
              , zuletzt: {thread.lastReply || thread.date}
            </div>
            {typeof document !== 'undefined' && (
              <ThreadCount
                hasNewMessages={hasNewMessages}
                count={thread.messages}
              />
            )}
          </div>
        </div>
      </Link>
    </li>
  )
}
