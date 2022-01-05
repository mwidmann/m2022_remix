import { Board } from '~/types'

export default function Header({ boards, isMenuOpen, setMenuOpen }: { boards: Board[], isMenuOpen: boolean, setMenuOpen: any }) {
  return (
    <div className="flex items-center justify-between bg-blue-500 px-4 py-2 text-blue-50 relative">
      <div>
        <select className="text-gray-900 rounded-md bg-blue-100 p-2">
          {boards.map(board => (
            <option key="{board.id}" value={board.id}>{board.boardName}</option>
          ))}
        </select>
      </div >
      <div>
        <button onClick={() => setMenuOpen(!isMenuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div >
    </div >
  )
}