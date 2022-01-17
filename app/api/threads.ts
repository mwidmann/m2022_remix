import * as cheerio from 'cheerio'
import type { LoaderFunction } from 'remix'
import { Thread } from '~/types'

export const fetchThreads: LoaderFunction = async ({ params }): Promise<Thread[] | Response> => {
  const id = params.boardId

  try {
    console.time("threads:content")
    const boardResposne = await fetch(`https://maniac-forum.de/forum/pxmboard.php?mode=threadlist&brdid=${id}`)
    const boardContent = await boardResposne.text()
    console.timeEnd("threads:content")

    console.time("thread:cheerio")

    const $ = cheerio.load(boardContent)

    const threads: Thread[] = []

    const $threadList = $('#threadlist')

    $threadList.find('> a').each((_, a) => {
      const $a = $(a)
      const title = $a.find(`font`).text() ?? ''
      const id = parseInt(($a.attr('onclick') ?? '').replace(`ld(`, '').replace(`,0)`, ''))
      threads.push({
        title,
        id,
        author: '',
        date: '',
        messages: 0
      })
    })

    $threadList.find('> font').each((index, f) => {
      const t = threads[index]
      const $f = $(f)
      t.author = $f.find('span').text().trim()
      $f.find('b').remove()
      let foundDate = $f.text()
      const m = [...foundDate.matchAll(/^\s+am\s+(\d{2}.\d{2}.\d{2} \d{2}:\d{2})\s+\(\s+Antworten: (\d+)/gm)]

      t.date = m[0][1]
      t.messages = parseInt(m[0][2])
    })

    $threadList.find('> img').each((index, img) => {
      const t = threads[index]
      const src = $(img).attr('src')
      t.isFixed = src?.includes('fixed.gif')
    })
    console.timeEnd("thread:cheerio")

    return threads
  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500
    })
  }
}