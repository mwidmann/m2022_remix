import { Outlet } from "@remix-run/react";
import { useRef, useEffect } from 'react'
import { Params } from 'react-router'
import { Settings, Logo, ThreadMessage } from '~/types'
import SingleMessage from './SingleMessage'

type Props = {
  params: Params<string>
  settings: Settings
  thread: ThreadMessage
}
export default function RegularThreadView({ params, settings, thread }: Props) {
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    listRef.current?.scrollTo(0, 0)
  }, [params.threadId])

  return (
    <>
      <div
        className="
          order-1 h-1/2 flex-shrink-0 flex-grow-0 overflow-hidden overflow-y-auto border-b border-b-gray-800
          lg:grow xl:order-2 xl:h-full
        "
      >
        {params.messageId ? (
          <Outlet />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-100/70 neon:text-neonf-100/10 neon:drop-shadow-neon dark:text-slate-800/30">
            {settings.logo === Logo.old ? (
              <svg
                viewBox="0 0 280 280"
                className="h-auto w-1/2 max-w-xs"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M57 245H13v-48h10V84H13V35h72l22 79 15-79h65v49h-9v113h9v48h-58v-48h9l-2-106-35 154H83L48 91v106h9v48ZM268 35h-68l2 49h8l4 94h42l3-94h7l2-49ZM264 196h-60v49h60v-49Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 280 280"
                className="h-auto w-1/2 max-w-xs"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 249V31h51l30 96h2l29-96h51v218h-48V145l-18 84H86l-16-84v104H21ZM259 31h-59v155h51l8-155ZM250 204h-50v45h48l2-45Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </div>
        )}
      </div>
      <div
        className="
          order-2 h-1/2 flex-shrink-0 flex-grow-0 overflow-y-auto
          overflow-x-hidden xl:order-1 xl:h-full xl:w-1/2
          xl:border-r
          2xl:w-1/3
        "
        ref={listRef}
      >
        {thread ? <SingleMessage message={thread} /> : null}
      </div>
    </>
  )
}
