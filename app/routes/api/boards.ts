import { JSDOM } from 'jsdom'
import { Board } from '~/types'

export async function loader() {
  try {
    const boardIndex = await fetch('https://maniac-forum.de/forum/pxmboard.php')
    if (!boardIndex || boardIndex === null) throw new Error
    const boardIndexContent = await boardIndex.text()
    const document = new JSDOM(boardIndexContent).window.document
    const boardsTable = document.querySelectorAll('table table')[2]
    const boardsRows = boardsTable.querySelectorAll('tr.bg2')
    const boards: Board[] =
      Array.from(boardsRows).map(boardsRow => {
        const boardsLink = (boardsRow.querySelector('td a') as HTMLAnchorElement)
        let boardName = ''
        let id = 0
        if (boardsLink) {
          boardName = boardsLink.textContent ?? ''
          id = parseInt(boardsLink.href.match(/brdid=(\d+)/)![1], 0)
        } else {
          boardName = boardsRow.querySelector('td#norm+td#norm')!.textContent ?? ''
        }
        const isOpen = (boardsRow.querySelector('td#norm img') as HTMLImageElement).src.includes(`open.gif`)
        const boardDesc = boardsRow.querySelector('td#norm+td#norm+td#norm')!.textContent ?? ''
        const lastPost = boardsRow.querySelector('td[align=center]')!.textContent ?? ''
        return {
          id,
          isOpen,
          boardName,
          boardDesc,
          lastPost
        }
      })
    return boards.filter(board => board.id !== 0)
  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500
    })
  }
}