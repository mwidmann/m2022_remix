import { Link, useParams, useTransition, Outlet } from 'remix'
import { ThreadMessage } from '~/types'
import { useContext, useEffect, useRef } from 'react'
import { AppContext } from '~/context/AppContext'

export default function InlineSingleMessage({
  message,
  scrollIntoView,
}: {
  message: ThreadMessage
  scrollIntoView: (element: HTMLDivElement) => void
}) {
  const context = useContext(AppContext)
  const transition = useTransition()
  const { messageId } = useParams()
  const indentation = {
    marginLeft: `${message.hierarchy - 1 + 0.5}rem`,
  }
  const singleMessageRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (isCurrentMessage) {
      scrollIntoView(singleMessageRef.current!)
    }
  }, [isCurrentMessage, singleMessageRef])

  return (
    <>
      <div
        className={`border-b border-gray-700 dark:border-gray-500 `}
        id={`msg${currentMessage}`}
      >
        <div ref={singleMessageRef}>
          {isCurrentMessage ? (
            <Outlet />
          ) : (
            <Link
              to={`message/${message.id}`}
              className={`block border-l-4 py-2 pr-2 visited:text-slate-400 neon:visited:text-neonf-400 dark:visited:text-slate-400 ${isCurrentUserClass}`}
            >
              <div
                style={indentation}
                className="flex items-start justify-between"
              >
                <div className="overflow-hidden">
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold md:text-base">
                    {message.title}
                  </p>
                  <p className="text-xs text-slate-500 neon:text-neonf-900 dark:text-slate-300">
                    <span className="font-sm font-semibold">
                      {message.author}
                    </span>{' '}
                    - {message.date}
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
      {message.children?.map((message) => (
        <InlineSingleMessage
          message={message}
          key={message.id}
          scrollIntoView={scrollIntoView}
        />
      ))}
    </>
  )
}
