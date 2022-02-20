import { Link, Outlet, useParams, useTransition } from 'remix'
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
  const isCurrentMessage = currentMessage === message.id
  const isCurrentClass =
    isLoading || isCurrentMessage
      ? `bg-blue-200 dark:bg-slate-600 dark:text-gray-100 shadow-md neon:bg-neonb-500 neon:text-neonf-300`
      : ``
  const isCurrentUserClass =
    context.currentUser?.username === message.author
      ? `border-red-500`
      : `border-transparent`

  return (
    <>
      <div
        className={`border-b border-gray-700 dark:border-gray-500 ${isCurrentClass}`}
        id={`msg${currentMessage}`}
      >
        <Link
          to={`message/${message.id}`}
          className={`block border-l-4 py-2 pr-2 visited:text-slate-400 neon:visited:text-neonf-400 maniac:text-maniac-link maniac:visited:text-maniac-linkv dark:visited:text-slate-400 ${isCurrentUserClass}`}
        >
          <div style={indentation} className="flex items-start justify-between">
            <div className="overflow-hidden">
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold md:text-base">
                {message.title}
              </p>
              <p className="text-xs text-slate-500 neon:text-neonf-900 dark:text-slate-300 maniac:text-black">
                <span className="font-sm font-semibold">{message.author}</span>{' '}
                - {message.date}
              </p>
            </div>
          </div>
        </Link>
      </div>
      {message.children?.map((message) => (
        <SingleMessage message={message} key={message.id} />
      ))}
    </>
  )
}
