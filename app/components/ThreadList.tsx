import { Thread } from "~/types"
import SingleThread from "~/components/Thread"
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { useParams } from "remix";
import { useEffect } from "react";

export default function ThreadList({ threads, updateCount, readMessages }: { threads: Thread[], updateCount: (thread: Thread) => void, readMessages: { [key: number]: number } }) {
  const { threadId } = useParams()
  return (
    <ul className="shadow-lg bg-white dark:bg-slate-900 z-10">
      {threads.map(thread => {
        const hasNewMessages = readMessages[thread.id] !== undefined ? thread.messages !== readMessages[thread.id] : true
        return <SingleThread thread={thread} key={thread.id + `_` + (hasNewMessages ? `t` : `f`)} updateCount={updateCount} hasNewMessages={hasNewMessages} currentThread={parseInt(threadId ?? '0', 10)} />
      })}
    </ul>
  )
}