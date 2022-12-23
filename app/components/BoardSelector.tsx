import { useState } from 'react'
import { Link } from "@remix-run/react";
import { Board } from '~/types'

export default function BoardSelector({
  boards,
  currentBoard,
}: {
  boards: Board[]
  currentBoard: number
}) {
  const [showList, setShowList] = useState<boolean>(false)

  const board = boards.find((b) => b.id === currentBoard)

  return (
    <div className="relative">
      <label
        id="listbox-label"
        className="sr-only block text-sm font-medium text-gray-700"
      >
        Forum
      </label>
      <button
        type="button"
        className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-xs text-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 neon:border-neonf-100 neon:bg-neonb-900 neon:text-neonf-100 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 md:text-sm lg:hidden"
        onClick={() => setShowList(!showList)}
      >
        <span className="flex items-center">
          <span className="block truncate">{board?.boardName}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <svg
              className="h-5 w-5 text-gray-400 neon:text-neonf-100"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </span>
      </button>
      <ul
        className={`absolute z-20 mt-1 max-h-56 w-full items-end overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 transition-opacity duration-300 focus:outline-none neon:bg-neonb-700 neon:ring-neonf-100 dark:bg-slate-900 dark:ring-gray-300 md:text-sm lg:relative lg:flex lg:space-x-4 lg:!bg-transparent lg:shadow-none lg:ring-0 ${
          showList
            ? `pointer-events-auto opacity-100`
            : `pointer-events-none opacity-0 lg:pointer-events-auto lg:opacity-100`
        }`}
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
      >
        {boards.map((board) => (
          <li
            className={`relative cursor-default select-none text-gray-900 hover:bg-blue-200 hover:text-blue-900 neon:text-neonf-100 dark:text-gray-300 lg:rounded-md lg:px-3 lg:text-gray-100 lg:hover:bg-gray-700 lg:hover:text-gray-100 neon:lg:text-neonf-100 dark:lg:text-gray-300 ${
              board.id === currentBoard ? `lg:bg-slate-700 lg:shadow-md` : ``
            }`}
            id="listbox-option-0"
            role="option"
            key={board.id}
          >
            <Link
              to={`/board/${board.id}`}
              onClick={() => setShowList(false)}
              reloadDocument
              className="block py-2 px-3"
            >
              <div className="flex items-center">
                <span className="block truncate font-normal">
                  {board.boardName}
                </span>
              </div>

              {board.id === currentBoard ? (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 neon:text-neonf-100 dark:text-indigo-300 lg:hidden">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
