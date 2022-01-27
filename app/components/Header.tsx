import { Board } from '~/types'
import {
  Form,
  Link,
  redirect,
  useParams,
  useTransition,
  useNavigate,
  useLocation,
} from 'remix'
import { type ActionFunction } from 'remix'
import { useState, useContext } from 'react'
import BoardSelector from './BoardSelector'
import Spinner from './Spinner'
import { darkMode } from '~/cookies/darkMode'
import { AppContext } from '~/context/AppContext'
import { type To } from 'react-router'

export default function Header({ boards }: { boards: Board[] }) {
  const transition = useTransition()
  const { isMenuOpen, setMenuOpen, pms, currentUser } = useContext(AppContext)
  const { boardId } = useParams()
  const isLoading = transition.state === 'loading'

  return (
    <div className="relative z-20 flex items-center justify-between border-b border-white bg-slate-900 px-2 py-2 drop-shadow-lg dark:drop-shadow-dark md:px-4">
      <div className="flex flex-grow items-center">
        <div className="flex items-center text-gray-100">
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
        </div>

        <div className="relative ml-4 flex items-center">
          <div className="w-44 lg:w-auto">
            <BoardSelector
              boards={boards}
              currentBoard={parseInt(boardId ?? '1', 10)}
            />
          </div>
          <div className="ml-4 h-5 w-5">{isLoading ? <Spinner /> : null}</div>
        </div>
      </div>
      <div className="relative flex items-center space-x-2 text-gray-100">
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
                pms && pms > 0 ? `bg-green-600` : `bg-slate-600`
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
