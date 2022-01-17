import * as cheerio from 'cheerio'
import type { LoaderFunction } from 'remix'
import { user } from '~/cookies/user'
import { Board, BoardsResponse } from '~/types'

export const fetchBoards: LoaderFunction = async ({ request }): Promise<BoardsResponse | Response> => {
  try {
    console.time("content")
    const cookieHeader = request.headers.get("Cookie")
    const userData = await user.parse(cookieHeader) || {}
    const boardIndex = await fetch('https://maniac-forum.de/forum/pxmboard.php', {
      headers: userData.cookie ? {
        'Cookie': userData.cookie
      } : {}
    })
    if (!boardIndex || boardIndex === null) throw new Error
    const boardIndexContent = await boardIndex.text()
    console.timeEnd("content")

    const match = boardIndexContent.match(/(\d+) neue private Nachricht\(en\)/m)
    let pms = undefined
    if (match) {
      pms = parseInt(match[1], 10)
    }

    console.time("cheerio")
    const $ = cheerio.load(boardIndexContent)
    const boardsTable = $(`table table`)[2]

    const boardsRows = $(boardsTable).find(`tr.bg2`)
    const boards: Board[] =
      Array.from(boardsRows).map(boardsRow => {
        const $boardsRow = $(boardsRow)
        const boardsLink = $boardsRow.find(`td a`)
        let boardName = ''
        let id = 0
        if (boardsLink) {
          boardName = boardsLink.text()
          id = parseInt(boardsLink.attr('href')?.match(/brdid=(\d+)/)![1] ?? '0', 0)
        } else {
          boardName = $boardsRow.find(`td#norm+td#norm`).text() ?? ''
        }
        const isOpen = $boardsRow.find('td#norm img').attr('src')?.includes(`open.gif`) || false
        const boardDesc = $boardsRow.find('td#norm+td#norm+td#norm').text() ?? ''
        const lastPost = $boardsRow.find('td[align=center]').text() ?? ''
        return {
          id,
          isOpen,
          boardName,
          boardDesc,
          lastPost
        }
      })
    console.timeEnd("cheerio")
    return { boards: boards.filter(board => board.id !== 0), pms }

  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500
    })
  }
}