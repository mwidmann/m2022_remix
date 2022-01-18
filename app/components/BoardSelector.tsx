import { useState } from "react";
import { Link } from "remix";
import { Board } from "~/types";

export default function BoardSelector({ boards, currentBoard }: { boards: Board[], currentBoard: number }) {

  const [showList, setShowList] = useState<boolean>(false)

  const board = boards.find(b => b.id === currentBoard)

  return (
    <div className="relative">
      <label id="listbox-label" className="block text-sm font-medium text-gray-700 sr-only">
        Forum
      </label>
      <button type="button" className="relative lg:hidden w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs md:text-sm text-gray-500 dark:text-gray-300" onClick={() => setShowList(!showList)}>
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <span className="ml-2 block truncate">
            {board?.boardName}
          </span>
          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </span>
      </button>
      <ul className={`absolute lg:relative z-20 mt-1 w-full lg:flex lg:space-x-4 items-end bg-white dark:bg-slate-900 lg:bg-transparent shadow-lg lg:shadow-none max-h-56 rounded-md py-1 ring-1 ring-black lg:ring-0 dark:ring-gray-300 ring-opacity-5 overflow-auto focus:outline-none text-xs md:text-sm transition-opacity duration-300 ${showList ? `opacity-100 pointer-events-auto` : `opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto`}`} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
        {boards.map(board => (
          <li className={
            `text-gray-900 dark:text-gray-300 lg:text-gray-100 dark:lg:text-gray-300 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-200 hover:text-blue-900 lg:hover:bg-gray-700 lg:hover:text-gray-100 lg:px-3 lg:rounded-md ${board.id === currentBoard ? `lg:bg-slate-700 lg:shadow-md` : ``}`
          }
            id="listbox-option-0" role="option" key={board.id}>
            <Link to={`/board/${board.id}`} onClick={() => setShowList(false)}>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <span className="font-normal ml-3 lg:ml-0 block truncate">
                  {board.boardName}
                </span>
              </div>

              {board.id === currentBoard ?
                <span className="text-indigo-600 dark:text-indigo-300 absolute inset-y-0 right-0 flex items-center pr-4 lg:hidden">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                : null
              }
            </Link>
          </li>

        ))}
      </ul>

    </div>
  )
}