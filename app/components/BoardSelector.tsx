import { useState } from 'react'
import { Link } from 'remix'
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
        className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-xs text-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 md:text-sm lg:hidden"
        onClick={() => setShowList(!showList)}
      >
        <span className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 md:h-4 md:w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
          <span className="ml-2 block truncate">{board?.boardName}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <svg
              className="h-5 w-5 text-gray-400"
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
        className={`absolute z-20 mt-1 max-h-56 w-full items-end overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 transition-opacity duration-300 focus:outline-none dark:bg-slate-900 dark:ring-gray-300 md:text-sm lg:relative lg:flex lg:space-x-4 lg:bg-transparent lg:shadow-none lg:ring-0 ${
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
            className={`relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-200 hover:text-blue-900 dark:text-gray-300 lg:rounded-md lg:px-3 lg:text-gray-100 lg:hover:bg-gray-700 lg:hover:text-gray-100 dark:lg:text-gray-300 ${
              board.id === currentBoard ? `lg:bg-slate-700 lg:shadow-md` : ``
            }`}
            id="listbox-option-0"
            role="option"
            key={board.id}
          >
            <Link to={`/board/${board.id}`} onClick={() => setShowList(false)}>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 lg:hidden"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
                <span className="ml-3 block truncate font-normal lg:ml-0">
                  {board.boardName}
                </span>
              </div>

              {board.id === currentBoard ? (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 dark:text-indigo-300 lg:hidden">
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
