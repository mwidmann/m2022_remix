import { Thread } from '~/types'
import SingleThread from '~/components/Thread'
import { useParams } from 'remix'

export default function ThreadList({
  threads,
  readMessages,
}: {
  threads: Thread[]
  readMessages: { [key: number]: number }
}) {
  const { threadId } = useParams()
  return (
    <ul className="z-10 shadow-lg">
      {threads.map((thread) => {
        const hasNewMessages =
          readMessages[thread.id] !== undefined
            ? thread.messages !== readMessages[thread.id]
            : true
        return (
          <SingleThread
            thread={thread}
            key={thread.id + `_` + (hasNewMessages ? `t` : `f`)}
            hasNewMessages={hasNewMessages}
            currentThread={parseInt(threadId ?? '0', 10)}
          />
        )
      })}
    </ul>
  )
}
