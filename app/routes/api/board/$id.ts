import { JSDOM } from "jsdom"
import { Thread } from '../../../types'

export async function loader({ params }: { params: { id: number } }) {
  const id = params.id

  try {
    const boardResposne = await fetch(`https://maniac-forum.de/forum/pxmboard.php?mode=threadlist&brdid=${id}`)
    const boardContent = await boardResposne.text()
    const document = new JSDOM(boardContent).window.document

    const threads: Thread[] = []

    Array.from(document.querySelectorAll(`#threadlist > a`)).forEach((a) => {
      const title = a.querySelector("font")?.textContent ?? ''
      const id = parseInt((a.getAttribute('onclick') ?? '').replace(`ld(`, '').replace(`,0)`, ''))
      threads.push({
        title,
        id,
        author: '',
        date: '',
        messages: 0
      })
    })

    Array.from(document.querySelectorAll('#threadlist > font')).forEach((f, index) => {
      const t = threads[index]
      t.author = f.querySelector('span')?.textContent?.trim() ?? ''
      f.querySelector('b')?.remove()
      let foundDate = f.textContent ?? ''
      const m = [...foundDate.matchAll(/^\s+am\s+(\d{2}.\d{2}.\d{2} \d{2}:\d{2})\s+\(\s+Antworten: (\d+)/gm)]

      t.date = m[0][1]
      t.messages = parseInt(m[0][2])
    })

    Array.from(document.querySelectorAll('#threadlist > img')).forEach((img, index) => {
      const t = threads[index]
      const src = img.getAttribute('src') ?? ''
      if (src.includes('fixed.gif')) {
        t.isFixed = true
      }
    })
    return threads
  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500
    })
  }
}