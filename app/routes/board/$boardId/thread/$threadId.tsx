import { LoaderFunction, useLoaderData } from "remix"
import { Message } from '~/types'

export const loader: LoaderFunction = async ({ params }) => {
  const response = await fetch(`http://localhost:3000/api/board/${params.boardId}/thread/${params.threadId}`)
  return await response.json()
}

export default function MessagesList() {
  const messages: Message[] = useLoaderData()
  return (
    <div>
      {JSON.stringify(messages)}

    </div>
  )
}