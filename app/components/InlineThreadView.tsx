import { Outlet } from 'remix'
import { useRef, useEffect } from 'react'
import { Params } from 'react-router'
import { Settings, Logo, ThreadMessage } from '~/types'
import InlineSingleMessage from './InlineSingleMessage'

type Props = {
  params: Params<string>
  settings: Settings
  thread: ThreadMessage
}
export default function InlineThreadView({ params, settings, thread }: Props) {
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    listRef.current?.scrollTo(0, 0)
  }, [params.threadId])

  return (
    <div className="h-full overflow-hidden">
      <div
        className="
        h-full
        overflow-y-auto overflow-x-hidden
        xl:border-r
      "
        ref={listRef}
      >
        {thread ? <InlineSingleMessage message={thread} /> : null}
      </div>
    </div>
  )
}