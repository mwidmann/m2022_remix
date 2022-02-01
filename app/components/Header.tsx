import { Board, Logo } from '~/types'
import { useParams, useTransition, Link } from 'remix'
import { useContext } from 'react'
import BoardSelector from './BoardSelector'
import Spinner from './Spinner'
import { AppContext } from '~/context/AppContext'

export default function Header({ boards }: { boards: Board[] }) {
  const transition = useTransition()
  const { isMenuOpen, setMenuOpen, pms, currentUser, settings } =
    useContext(AppContext)
  const { boardId, threadId } = useParams()
  const isLoading = transition.state === 'loading'

  return (
    <div className="relative z-20 flex items-center justify-between border-b border-white bg-slate-900 px-2 py-2 drop-shadow-lg neon:bg-neonb-900 dark:drop-shadow-dark md:px-4">
      <div className="flex flex-grow items-center">
        <div className="flex items-center text-gray-100 neon:animate-glow-md neon:text-neonf-100">
          {settings.logo === Logo.old ? (
            <svg
              viewBox="0 0 280 280"
              className="h-8 w-8"
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
              className="h-8 w-8"
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

        <div className="relative ml-4 flex items-center">
          <div className="w-36 lg:w-auto">
            <BoardSelector
              boards={boards}
              currentBoard={parseInt(boardId ?? '1', 10)}
            />
          </div>
          <div className="ml-4 h-5 w-5">{isLoading ? <Spinner /> : null}</div>
        </div>
      </div>
      <div className="relative flex items-center space-x-2 text-gray-100 neon:text-neonf-100">
        {currentUser && threadId === undefined ? (
          <Link
            to={`/board/${boardId}/new-thread`}
            className="flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <div className="hidden md:block">Thread erstellen</div>
          </Link>
        ) : null}
        {currentUser ? (
          <button className="relative" onClick={() => alert(`coming soon`)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div
              className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold text-white shadow ${
                pms && pms > 0
                  ? `bg-green-600 neon:animate-glow-md`
                  : `bg-slate-600`
              }`}
            >
              {pms}
            </div>
          </button>
        ) : null}
        <button
          onClick={() => {
            if (isMenuOpen) {
              setMenuOpen(false)
            } else {
              setMenuOpen(true)
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
    </div>
  )
}
