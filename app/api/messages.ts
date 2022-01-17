import * as cheerio from 'cheerio'
import type { LoaderFunction } from "remix";
import { ThreadMessage } from '~/types';

export const fetchMessages: LoaderFunction = async ({ params }): Promise<ThreadMessage[] | Response> => {
  try {
    console.time("messages:content")
    const { boardId, threadId } = params
    const threadResponse = await fetch(`https://maniac-forum.de/forum/pxmboard.php?mode=thread&brdid=${boardId}&thrdid=${threadId}`)
    const threadContent = await threadResponse.text()
    console.timeEnd("messages:content")

    console.time("messages:cheerio")
    const $ = cheerio.load(threadContent)

    const messages: ThreadMessage[] = []

    $('li').each((_, li) => {
      const $li = $(li)
      const title = $li.find(`a > font`).text()
      const hierarchy = $li.parents('ul').length
      const author = $li.find('span span').text().trim()
      const name = $li.find(`a`).attr('name') ?? ''
      const id = parseInt(name?.replace('p', ''), 10)

      const $f = $li.find(`li > span > font`)
      $f.remove(`> b`)
      const foundDate = $f.text()
      const date = foundDate.replace(' - ', '')
      messages.push({
        title,
        hierarchy,
        author,
        id,
        date
      })
    })

    console.timeEnd("messages:cheerio")

    return messages;

  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500
    })
  }
}