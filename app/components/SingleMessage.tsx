import { Link, useParams, useTransition } from "remix";
import { ThreadMessage } from "~/types";
import { useContext } from "react";
import { AppContext } from "~/context/AppContext";

export default function SingleMessage({ message }: { message: ThreadMessage }) {
  const context = useContext(AppContext)
  const transition = useTransition()
  const { messageId } = useParams()
  const indentation = {
    marginLeft: `${message.hierarchy}rem`,
  }

  const currentMessage = parseInt(messageId ?? '0')
  const isLoading = transition.state === 'loading' && transition.location?.pathname?.endsWith(`message/${message.id}`)
  const isCurrentClass = isLoading || currentMessage === message.id ? `bg-blue-200 dark:bg-slate-600 dark:text-gray-100 shadow-md` : ``
  const isCurrentUserClass = context.currentUser?.username === message.author ? `border-red-500` : `border-transparent`

  return (
    <div className={`border-b border-gray-700 darnk:border-gray-500 ${isCurrentClass}`} id={`msg${currentMessage}`}>
      <Link to={`message / ${message.id} `} className={`block border-l-4 text-gray-900 dark:text-gray-100 visited:text-gray-500 dark:visited:text-gray-400 pr-2 py-2 ${isCurrentUserClass}`}>
        <div style={indentation} className="flex items-start justify-between">
          <div className="overflow-hidden">
            <p className="text-sm md:text-base font-semibold overflow-hidden whitespace-nowrap text-ellipsis">{message.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300"><span className="font-semibold font-sm">{message.author}</span> - {message.date}</p>
          </div>
        </div>
      </Link>
    </div >
  )
}