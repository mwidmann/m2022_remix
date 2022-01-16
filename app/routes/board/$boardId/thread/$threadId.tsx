import { LoaderFunction, Outlet, useNavigate, useLoaderData, useParams, useTransition } from "remix"
import { ThreadMessage } from '~/types'
import SingleMessage from "~/components/SingleMessage"
import { useEffect, useRef } from "react"

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

export const loader: LoaderFunction = async ({ params }) => {
  const response = await fetch(`http://localhost:3000/api/board/${params.boardId}/thread/${params.threadId}`)
  return await response.json()
}

export default function MessagesList() {
  const params = useParams()
  const transition = useTransition()

  const messages: ThreadMessage[] = useLoaderData()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)


  useEffect(() => {
    if (parseInt(params.messageId ?? '0') === 0) {
      navigate(`message/${messages[0].id}`)
    }
  }, [params.messageId])

  useEffect(() => {
    const handler = function (e: Event) {
      console.log(e.target); // element that was swiped
      console.log((e as SwipeEvent).detail); // see event data below

      if (ref.current !== null) {
        ref.current.style.transform = "translateX(83.33333333%)"
      }
    }

    ref.current?.addEventListener('swiped-right', handler);
    console.log(`added listener to`, ref.current)
    return () => { console.log(`removed listener...`); ref.current?.removeEventListener('swiped-right', handler) }
  }, [ref.current])

  useEffect(() => {
    if (ref.current)
      ref.current.style.transform = "translateX(0)"
  }, [transition.state])

  return (
    <div className="absolute bg-white dark:bg-slate-900 md:relative inset-0 flex flex-col flex-grow w-full select-none z-10 transition-transform duration-300 drop-shadow-lg dark:drop-shadow-dark order-2" ref={ref}>
      <div className="flex-grow-0 flex-shrink-0 h-1/2 overflow-y-auto overflow-x-hidden border-b border-b-gray-800">
        <Outlet />
      </div>
      <div className="flex-grow-0 flex-shrink-0 h-1/2 overflow-y-auto overflow-x-hidden">
        {messages.map(message => (<SingleMessage message={message} key={message.id} />))}
      </div>
    </div>
  )
}