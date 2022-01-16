import { JSDOM } from 'jsdom'
import { Board } from '~/types'
import { user } from '~/cookies/user'

export async function loader({ request }: { request: Request }) {
  try {
    const cookieHeader = request.headers.get("Cookie")
    const userData = await user.parse(cookieHeader) || {}
    const boardIndex = await fetch('https://maniac-forum.de/forum/pxmboard.php', {
      headers: userData.cookie ? {
        'Cookie': userData.cookie
      } : {}
    })
    if (!boardIndex || boardIndex === null) throw new Error
    const boardIndexContent = await boardIndex.text()

    const match = boardIndexContent.match(/(\d+) neue private Nachricht\(en\)/m)
    let pms = undefined
    if (match) {
      pms = parseInt(match[1], 10)
    }

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
    return { boards: boards.filter(board => board.id !== 0), pms }
  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500
    })
  }
}