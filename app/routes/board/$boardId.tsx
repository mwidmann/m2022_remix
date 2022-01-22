import { LoaderFunction, Outlet, useOutletContext, useParams } from "remix"
import { useLoaderData } from "remix"
import { useLocalStorage } from "~/hooks/useLocalStorage"
import ThreadList from '~/components/ThreadList'
import { Thread } from "~/types"
import { fetchThreads } from "~/api"
import { useEffect, useRef } from "react"

export const loader: LoaderFunction = async (context): Promise<Thread[] | Response> => {
  return await fetchThreads(context)
}

export default function Board() {
  const params = useParams()
  let threads: Thread[] = useLoaderData()
  const boardRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useLocalStorage<Record<number, number>>(`count_${params.boardId}`, {})

  useEffect(() => {
    boardRef.current?.scrollTo(0, 0)
  }, [params.boardId])

  return (
    <div className="h-full relative md:flex overflow-hidden">
      {
        params.threadId
          ? <Outlet context={{ count, setCount }} />
          : <div className="absolute md:relative inset-0 flex-grow w-full order-2"></div>
      }
      <div ref={boardRef} className="
        absolute flex-grow flex-shrink-0 top-0 left-0 bottom-0 w-5/6 max-w-5/6 overflow-y-auto order-1
        md:relative md:w-1/3 md:max-w-1/3
        xl:w-1/5 xl:max-w-1/5
        ">
        <ThreadList threads={threads} readMessages={count} />
      </div>
    </div>
  )
}

export type ThreadReadCount = Record<number, number>
export type ContextType = {
  count: ThreadReadCount,
  setCount: (count: ThreadReadCount | ((count: ThreadReadCount) => void)) => void
}

export function useThreadMessageCount() {
  return useOutletContext<ContextType>()
}