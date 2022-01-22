import { LoaderFunction, Outlet, useNavigate, useLoaderData, useParams, useTransition, useOutletContext } from "remix"
import { ThreadMessage } from '~/types'
import SingleMessage from "~/components/SingleMessage"
import { useEffect, useRef } from "react"
import { fetchMessages } from '~/api'
import { useThreadMessageCount } from '~/routes/board/$boardId'

interface SwipeEvent extends Event {
  detail: {
    dir: 'up' | 'down' | 'left' | 'right',
    touchType: 'direct' | 'stylus',
    xStart: number,
    xEnd: number,
    yStart: number,
    yEnd: number
  }
}

export const loader: LoaderFunction = async (context): Promise<ThreadMessage[] | Response> => {
  return await fetchMessages(context)
}

export default function MessagesList() {
  const params = useParams()
  const transition = useTransition()

  const messages: ThreadMessage[] = useLoaderData()
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const { setCount } = useThreadMessageCount();

  useEffect(() => {
    const handler = function (e: Event) {
      if (ref.current !== null) {
        ref.current.style.transform = "translateX(83.33333333%)"
      }
    }

    ref.current?.addEventListener('swiped-right', handler);
    return () => { ref.current?.removeEventListener('swiped-right', handler) }
  }, [ref.current])

  useEffect(() => {
    listRef.current?.scrollTo(0, 0)
    setCount(oldCount => ({
      ...oldCount,
      [`${params.threadId}`]: messages.length - 1,
    }))
  }, [params.threadId])

  useEffect(() => {
    if (ref.current)
      ref.current.style.transform = "translateX(0)"
  }, [transition.state])

  return (
    <div className="
      absolute inset-0 flex flex-col flex-grow w-full select-none z-10 transition-transform duration-300 drop-shadow-lg order-2 bg-white
      dark:drop-shadow-dark dark:bg-slate-900
      md:relative
      xl:flex-row
      "
      ref={ref}
    >
      <div className="
        flex-grow-0 flex-shrink-0 h-1/2 overflow-y-auto overflow-hidden border-b border-b-gray-800 order-1
        xl:order-2 xl:h-full lg:grow
      ">
        {params.messageId ?
          <Outlet /> :
          <div className="flex items-center h-full justify-center text-gray-100/70 dark:text-slate-800/30">
            <svg viewBox="0 0 280 280" className="w-1/2 h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 249V31h51l30 96h2l29-96h51v218h-48V145l-18 84H86l-16-84v104H21ZM259 31h-59v155h51l8-155ZM250 204h-50v45h48l2-45Z" fill="currentColor" />
            </svg>
          </div>
        }
      </div>
      <div className="
        flex-grow-0 flex-shrink-0 h-1/2 overflow-y-auto overflow-x-hidden
        xl:h-full xl:w-1/2 xl:border-r order-2
        xl:order-1
        2xl:w-1/3
        "
        ref={listRef}
      >
        {messages.map(message => (<SingleMessage message={message} key={message.id} />))}
      </div>
    </div>
  )
}