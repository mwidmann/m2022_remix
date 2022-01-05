import { LoaderFunction, Outlet, useLoaderData } from "remix"
import { Message } from '~/types'
import SingleMessage from "~/components/SingleMessage"

export const loader: LoaderFunction = async ({ params }) => {
  const response = await fetch(`http://localhost:3000/api/board/${params.boardId}/thread/${params.threadId}`)
  return await response.json()
}

export default function MessagesList() {
  const messages: Message[] = useLoaderData()
  return (
    <div
      className="bg-white border-l border-gray-800 flex-grow grid grid-cols-1 grid-rows-2 z-1 transition-transform overflow-hidden items-stretch justify-self-stretch translate-x-10"
    >
      {/* translate-x-[90%] */}
      <div className="overflow-hidden bg-blue-300">
        <div className="overflow-y-auto h-full"><Outlet /></div>
      </div>
      <div className="overflow-hidden">
        <div className="overflow-y-auto h-full">
          {messages.map(message => (<SingleMessage message={message} key={message.id} />))}

        </div>
      </div>
    </div>
  )
}