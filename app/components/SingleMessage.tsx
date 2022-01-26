import { Link, useParams, useTransition } from 'remix'
import { ThreadMessage } from '~/types'
import { useContext } from 'react'
import { AppContext } from '~/context/AppContext'

export default function SingleMessage({ message }: { message: ThreadMessage }) {
  const context = useContext(AppContext)
  const transition = useTransition()
  const { messageId } = useParams()
  const indentation = {
    marginLeft: `${message.hierarchy - 1 + 0.5}rem`,
  }

  const currentMessage = parseInt(messageId ?? '0')
  const isLoading =
    transition.state === 'loading' &&
    transition.location?.pathname?.endsWith(`message/${message.id}`)
  const isCurrentClass =
    isLoading || currentMessage === message.id
      ? `bg-blue-200 dark:bg-slate-600 dark:text-gray-100 shadow-md`
      : ``
  const isCurrentUserClass =
    context.currentUser?.username === message.author
      ? `border-red-500`
      : `border-transparent`

  return (
    <div
      className={`darnk:border-gray-500 border-b border-gray-700 ${isCurrentClass}`}
      id={`msg${currentMessage}`}
    >
      <Link
        to={`message/${message.id}`}
        className={`block border-l-4 py-2 pr-2 visited:text-slate-400 dark:visited:text-slate-400 ${isCurrentUserClass}`}
      >
        <div style={indentation} className="flex items-start justify-between">
          <div className="overflow-hidden">
            {' '}
            <p className="flex overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold md:text-base">
              {message.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              <span className="font-sm font-semibold">{message.author}</span> -{' '}
              {message.date}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
