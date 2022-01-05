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
      <Outlet />
    </div >

  )
}