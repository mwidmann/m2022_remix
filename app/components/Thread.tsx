import { Link, useTransition } from "remix";
import { Thread } from "~/types";
import ThreadCount from "./ThreadCount";

export default function SingleThread({ thread, hasNewMessages, currentThread }: { thread: Thread, hasNewMessages: boolean, currentThread: number }) {
  const transition = useTransition()
  const isLoading = transition.state === 'loading' && transition.location?.pathname?.endsWith(`thread/${thread.id}`)
  const isCurrentClass = isLoading || currentThread === thread.id ? `bg-blue-200 dark:bg-slate-600 dark:text-gray-100 shadow-md` : ``
  return (
    <li className={`border-b border-gray-700 dark:border-gray-500 ${isCurrentClass}`}>
      <Link to={`thread/${thread.id}`} className="w-full text-left text-sm text-gray-900 dark:text-gray-100 visited:text-gray-500 dark:visited:text-gray-400">
        <div className="w-full p-2">
          <div className="flex justify-between">
            <p className="text-sm md:text-base font-semibold">{thread.title}</p>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-300 w-full">
            <div>von <span className="font-semibold font-sm">{thread.author}</span>, zuletzt: {thread.lastReply || thread.date}</div>
            {typeof document !== "undefined" && <ThreadCount hasNewMessages={hasNewMessages} count={thread.messages} />}
          </div>
        </div>
      </Link>
    </li>
  )
}