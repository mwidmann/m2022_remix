import {
  LoaderFunction,
  Outlet,
  useNavigate,
  useLoaderData,
  useParams,
  useTransition,
  useOutletContext,
} from 'remix'
import { ThreadMessage } from '~/types'
import SingleMessage from '~/components/SingleMessage'
import { useEffect, useRef } from 'react'
import { fetchMessages } from '~/api'
import { useThreadMessageCount } from '~/routes/board/$boardId'

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

  const { thread, count }: { thread: ThreadMessage; count: number } =
    useLoaderData()
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const { setCount } = useThreadMessageCount()

  useEffect(() => {
    const handler = function (e: Event) {
      if (ref.current !== null) {
        ref.current.style.transform = 'translateX(83.33333333%)'
      }
    }

    ref.current?.addEventListener('swiped-right', handler)
    return () => {
      ref.current?.removeEventListener('swiped-right', handler)
    }
  }, [ref.current])

  useEffect(() => {
    listRef.current?.scrollTo(0, 0)
    setCount((oldCount) => ({
      ...oldCount,
      [`${params.threadId}`]: count,
    }))
  }, [params.threadId])

  useEffect(() => {
    if (ref.current) ref.current.style.transform = 'translateX(0)'
  }, [transition.state])

  return (
    <div
      className="
      absolute inset-0 z-10 order-2 flex w-full flex-grow select-none flex-col bg-white drop-shadow-lg transition-transform duration-300
      dark:bg-slate-900 dark:drop-shadow-dark
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
          <div className="flex h-full items-center justify-center text-gray-100/70 dark:text-slate-800/30">
            <svg
              viewBox="0 0 280 280"
              className="h-auto w-1/2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 249V31h51l30 96h2l29-96h51v218h-48V145l-18 84H86l-16-84v104H21ZM259 31h-59v155h51l8-155ZM250 204h-50v45h48l2-45Z"
                fill="currentColor"
              />
            </svg>
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
        <SingleMessage message={thread} />
      </div>
    </div>
  )
}
