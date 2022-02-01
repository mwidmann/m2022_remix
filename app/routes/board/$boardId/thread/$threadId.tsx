import {
  LoaderFunction,
  Outlet,
  useNavigate,
  useLoaderData,
  useParams,
  useTransition,
  useMatches,
} from 'remix'
import { ThreadMessage, Thread, Logo } from '~/types'
import SingleMessage from '~/components/SingleMessage'
import { useEffect, useRef } from 'react'
import { fetchMessages } from '~/api'
import { useThreadMessageCount } from '~/routes/board/$boardId'
import { useContext } from 'react'
import { AppContext } from '~/context/AppContext'

interface SwipeEvent extends Event {
  detail: {
    dir: 'up' | 'down' | 'left' | 'right'
    touchType: 'direct' | 'stylus'
    xStart: number
    xEnd: number
    yStart: number
    yEnd: number
  }
}

export const loader: LoaderFunction = async (
  context
): Promise<ThreadMessage[] | Response> => {
  return await fetchMessages(context)
}

export default function MessagesList() {
  const params = useParams()
  const transition = useTransition()
  const matches = useMatches()

  const { thread, count }: { thread: ThreadMessage; count: number } =
    useLoaderData()
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const { setCount } = useThreadMessageCount()
  const { settings } = useContext(AppContext)

  useEffect(() => {
    const handleRightSwipe = function () {
      if (ref.current !== null) {
        ref.current.style.transform = 'translateX(83.33333333%)'
      }
    }
    const handleLeftSwipeOrClick = function () {
      if (ref.current !== null) {
        ref.current.style.transform = `translateX(0)`
      }
    }

    ref.current?.addEventListener('swiped-right', handleRightSwipe)
    ref.current?.addEventListener('swiped-left', handleLeftSwipeOrClick)
    ref.current?.addEventListener('click', handleLeftSwipeOrClick)
    return () => {
      ref.current?.removeEventListener('swiped-right', handleRightSwipe)
      ref.current?.removeEventListener('swiped-left', handleLeftSwipeOrClick)
      ref.current?.removeEventListener('click', handleLeftSwipeOrClick)
    }
  }, [ref.current])

  useEffect(() => {
    if (ref.current) ref.current.style.transform = 'translateX(0)'
  }, [transition.state])

  useEffect(() => {
    listRef.current?.scrollTo(0, 0)

    const boardMatch = matches.find((m) => m.id === `routes/board/$boardId`)
    if (boardMatch && boardMatch.data) {
      const t = (boardMatch.data as Thread[]).find(
        (t) => t.id === parseInt(params.threadId ?? '0', 10)
      )
      if (t) {
        setCount((oldCount) => ({
          ...oldCount,
          [`${params.threadId}`]: t.messages,
        }))
      }
    }
  }, [params.threadId])

  return (
    <div
      className="
      absolute inset-0 z-10 order-2 flex w-full flex-grow select-none flex-col bg-white drop-shadow-lg transition-transform duration-300
      neon:bg-neonb-900 dark:bg-slate-900
      dark:drop-shadow-dark
      md:relative
      xl:flex-row
      "
      ref={ref}
    >
      <div
        className="
        order-1 h-1/2 flex-shrink-0 flex-grow-0 overflow-hidden overflow-y-auto border-b border-b-gray-800
        lg:grow xl:order-2 xl:h-full
      "
      >
        {params.messageId ? (
          <Outlet />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-100/70 neon:text-neonf-100/10 neon:drop-shadow-neon dark:text-slate-800/30">
            {settings.logo === Logo.new ? (
              <svg
                viewBox="0 0 280 280"
                className="h-auto w-1/2 max-w-xs"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 249V31h51l30 96h2l29-96h51v218h-48V145l-18 84H86l-16-84v104H21ZM259 31h-59v155h51l8-155ZM250 204h-50v45h48l2-45Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 280 280"
                className="h-auto w-1/2 max-w-xs"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M57 245H13v-48h10V84H13V35h72l22 79 15-79h65v49h-9v113h9v48h-58v-48h9l-2-106-35 154H83L48 91v106h9v48ZM268 35h-68l2 49h8l4 94h42l3-94h7l2-49ZM264 196h-60v49h60v-49Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </div>
        )}
      </div>
      <div
        className="
        order-2 h-1/2 flex-shrink-0 flex-grow-0 overflow-y-auto
        overflow-x-hidden xl:order-1 xl:h-full xl:w-1/2
        xl:border-r
        2xl:w-1/3
        "
        ref={listRef}
      >
        {thread ? <SingleMessage message={thread} /> : null}
      </div>
    </div>
  )
}
