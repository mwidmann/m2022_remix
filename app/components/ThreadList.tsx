import { Thread } from "~/types"
import SingleThread from "~/components/Thread"

export default function ThreadList({ threads }: { threads: Thread[] }) {
  return (
    <ul>
      {threads.map(thread => (<SingleThread thread={thread} key={thread.id} />))}
    </ul>
  )
}