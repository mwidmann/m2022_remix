import { LoaderFunction, Outlet, useParams } from "remix"
import { useLoaderData } from "remix"
import { useLocalStorage } from "~/hooks/useLocalStorage"
import ThreadList from '~/components/ThreadList'
import { Thread } from "~/types"
import { fetchThreads } from "~/api"

export const loader: LoaderFunction = async (context): Promise<Thread[] | Response> => {
  return await fetchThreads(context)
}

export default function Board() {
  const params = useParams()
  let threads: Thread[] = useLoaderData()
  const [count, setCount] = useLocalStorage<{ [key: number]: number }>(`count_${params.boardId}`, [])

  const updateCount = (thread: Thread) => {
    setCount({
      ...count,
      [thread.id]: thread.messages,
    })
  }

  return (
    <div className="h-full relative md:flex overflow-hidden">
      {
        params.threadId
          ? <Outlet />
          : <div className="absolute md:relative inset-0 flex-grow w-full order-2 bg-white dark:bg-slate-900"></div>
      }
      <div className="absolute md:relative flex-grow flex-shrink-0 top-0 left-0 bottom-0 w-5/6 max-w-5/6 md:w-1/3 md:max-w-1/3 overflow-y-auto order-1">
        <ThreadList threads={threads} updateCount={updateCount} readMessages={count} />
      </div>

    </div>

  )
}