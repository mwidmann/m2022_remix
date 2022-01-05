import { LoaderFunction, Outlet } from "remix"
import { useLoaderData } from "remix"
import { Thread } from "~/types"
import ThreadList from '~/components/ThreadList'

export const loader: LoaderFunction = async ({ params }) => {
  const response = await fetch(`http://localhost:3000/api/board/${params.boardId}`)
  return await response.json()
}

export default function Board() {
  const threads: Thread[] = useLoaderData()

  return (
    <div className="overflow-hidden relative flex-grow flex">
      <div className="overflow-y-auto w-[89%] absolute top-0 left-0 bottom-0 z-0">
        <ThreadList threads={threads} />
      </div>
      <div
        className="flex-grow grid grid-cols-1 grid-rows-2 z-1 transition-transform overflow-hidden items-stretch justify-self-stretch translate-x-[90%]"
      >
        <div className="overflow-hidden bg-blue-300">
          <div className="overflow-y-auto h-full">asdf</div>
        </div>
        <div className="overflow-hidden bg-green-300">
          <div className="overflow-y-auto h-full"><Outlet /></div>
        </div>
      </div>
    </div >

  )
}