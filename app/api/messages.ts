import * as cheerio from 'cheerio'
import type { LoaderFunction } from 'remix'
import type { SettingsCookie, ThreadMessage } from '~/types'
import { parse } from 'date-fns'
import { settings as settingsCookie } from '~/cookies/settings'

const sort = (message: ThreadMessage) => {
  message.children = message.children?.sort((m1, m2) => m2.ts - m1.ts)
  message.children.forEach((m) => sort(m))
  message.tts =
    message.children.length > 0 ? message.children[0].tts : message.ts
  return message
}

export const fetchMessages: LoaderFunction = async ({
  request,
  params,
}): Promise<{ thread: ThreadMessage; count: number }> => {
  console.time('messages:content')

  const cookieHeader = request.headers.get('Cookie')
  const settings: SettingsCookie =
    (await settingsCookie.parse(cookieHeader)) || {}

  const { boardId, threadId } = params
  const threadResponse = await fetch(
    `https://maniac-forum.de/forum/pxmboard.php?mode=thread&brdid=${boardId}&thrdid=${threadId}`
  )
  const threadContent = await threadResponse.text()
  console.timeEnd('messages:content')

  console.time('messages:cheerio')
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
    const foundDate = $f.text().replace(' - ', '').split('\n') ?? []
    const date = foundDate[foundDate.length - 1]
    const ts = parse(date, 'dd.MM.yy HH:mm', new Date())
    messages.push({
      title,
      hierarchy,
      author,
      id,
      date,
      ts: ts.getTime(),
      tts: ts.getTime(),
      children: [],
    })
  })

  console.timeEnd('messages:cheerio')

  const lastMessageAtLevel: Record<number, ThreadMessage> = {}
  let threaded = messages.reduce<null | ThreadMessage>(
    (tl, message: ThreadMessage) => {
      lastMessageAtLevel[message.hierarchy] = message
      if (tl === null) {
        return message
      }
      lastMessageAtLevel[message.hierarchy - 1].children?.push(message)
      return tl
    },
    null
  )

  if (settings.order === 'by-newest-answer') {
    threaded = sort(threaded!)
    threaded.children?.sort((m1, m2) => m2.tts - m1.tts)
  }

  // return messages;
  return { thread: threaded!, count: messages.length }
}
