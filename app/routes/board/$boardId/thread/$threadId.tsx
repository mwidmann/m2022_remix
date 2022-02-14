import {
  LoaderFunction,
  useLoaderData,
  useParams,
  useTransition,
  useMatches,
} from 'remix'
import { ThreadMessage, Thread, Logo, DisplayModes } from '~/types'
import SingleMessage from '~/components/SingleMessage'
import { useEffect, useRef } from 'react'
import { fetchMessages } from '~/api'
import { useThreadMessageCount } from '~/routes/board/$boardId'
import { useContext } from 'react'
import { AppContext } from '~/context/AppContext'
import InlineThreadView from '~/components/InlineThreadView'
import RegularThreadView from '~/components/RegularThreadView'

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

type LoaderData = { thread: ThreadMessage; count: number }

export const loader: LoaderFunction = async (context): Promise<LoaderData> => {
  return await fetchMessages(context)
}

export default function MessagesList() {
  const params = useParams()
  const transition = useTransition()
  const matches = useMatches()

  const { thread, count } = useLoaderData<LoaderData>()
  const ref = useRef<HTMLDivElement>(null)
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
      ref={ref}
      className="
        absolute inset-0 z-10 order-2 flex w-full flex-grow select-none flex-col bg-white drop-shadow-lg transition-transform duration-300 neon:bg-neonb-900 dark:bg-slate-900
        dark:drop-shadow-dark
        md:relative
        xl:flex-row
      "
    >
      {settings.displayMode === DisplayModes.inline ? (
        <InlineThreadView thread={thread} params={params} settings={settings} />
      ) : (
        <RegularThreadView
          thread={thread}
          params={params}
          settings={settings}
        />
      )}
    </div>
  )
}
