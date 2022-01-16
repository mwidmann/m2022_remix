import { JSDOM } from "jsdom"
import { Message } from '~/types'

type MessageInfo = {
  brdid?: number,
  thrdid?: number,
  msgid?: number
}
const extractMessageInfo = (str: string): MessageInfo => {
  const regex = /(brdid|msgid|thrdid)=(\d*)/gm;
  let m
  let r = {
    brdid: 0,
    thrdid: 0,
    msgid: 0
  }
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    r[(m[1] as keyof MessageInfo)] = parseInt(m[2] as string)
  }
  return r
}

const renderNestedBlockquotes = (str: string): string => {
  const lines = str.split(`\n`)
  let nestingLevel = 0
  let nestedBlockquotes = ``

  lines.forEach(line => {
    let match = line.match(/^(&gt;)*/)
    if (match !== null) {
      const currentNestingLevel = match[0].length / 4
      console.log(currentNestingLevel)
      if (currentNestingLevel > nestingLevel) {
        for (let i = nestingLevel; i < currentNestingLevel; i++) {
          nestedBlockquotes += `<div class="blockquote">`
        }
        nestingLevel = currentNestingLevel
      }

      nestedBlockquotes += line.replace(match[0], '').replace(`<br>`, '')

      if (currentNestingLevel < nestingLevel) {
        for (let i = nestingLevel; i > currentNestingLevel; i--) {
          nestedBlockquotes += `</div>`
        }
        nestingLevel = currentNestingLevel
      }
    }
  })
  for (let i = 0; i < nestingLevel; i++) {
    nestedBlockquotes += `</div>`
  }

  console.log(nestedBlockquotes)
  return nestedBlockquotes
}

export async function loader({ params }: { params: { id: number, threadId: number, messageId: number } }): Promise<Message | Response> {
  try {
    const { id, messageId } = params
    const messageResponse = await fetch(`https://maniac-forum.de/forum/pxmboard.php?mode=message&brdid=${id}&msgid=${messageId}`)
    const messageContent = await messageResponse.text()
    const document = new JSDOM(messageContent).window.document

    let contentEl = document.querySelector('.bg2 > td > font')
    let replacements: { find: string, replaceWith: string }[] = []

    if (contentEl) {
      Array.from(contentEl.querySelectorAll(`a`)).forEach(a => {
        const href = a.href

        // internal link
        let match = href.match(/pxmboard.php\?mode=message/)
        if (match !== null) {
          match = href.match(/(brdid|msgid|thrdid)=(\d*)/)
          try {
            const { brdid, thrdid, msgid } = extractMessageInfo(href)
            a.href = `/board/${brdid}/thread/${thrdid}/message/${msgid}`
          } catch (e) {
            // do nothing....
          }
        }

        // youtube video
        match = href.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
        if (match !== null) {
          const youtubeIframe = document.createElement(`iframe`) as HTMLIFrameElement
          youtubeIframe.src = `https://youtube.com/embed/${match[1]}`
          youtubeIframe.allowFullscreen = true
          youtubeIframe.classList.add('w-96', 'aspect-video')
          // a.parentNode?.insertBefore(youtubeIframe, br.nextSibling)
          replacements.push({
            find: '[' + a.outerHTML + ']',
            replaceWith: '[' + a.outerHTML + ']<br><br>' + youtubeIframe.outerHTML
          })
        }

        // images
        match = href.match(/.jpe?g|.gif|.png$/)
        if (match !== null) {
          const img = document.createElement(`img`) as HTMLImageElement
          img.src = href
          img.classList.add(`w-96`, `h-auto`)
          replacements.push({
            find: '[' + a.outerHTML + ']',
            replaceWith: '[' + a.outerHTML + ']<br><br>' + img.outerHTML
          })
        }
      })
    }
    const title = document.querySelector('table > tbody > tr > td > table > tbody > tr > td > b')?.textContent?.trim() ?? ''

    const el = document.querySelector('table > tbody > tr:nth-child(2) > td#norm > a')
    const author = el?.textContent?.trim() ?? ''
    const href = el?.getAttribute('href')
    const authorId = parseInt(href?.replace(/.*usrid=/, '') ?? '0')
    const date = document.querySelector('table > tbody > tr:nth-child(3) > td#norm:nth-child(2)')?.textContent?.trim() ?? ''

    let content = document.querySelector('.bg2 > td > font')?.innerHTML ?? ''
    // find all blockquotes
    Array.from(document.querySelectorAll(`font[color='808080']`)).forEach(bq => {
      content = content.replace(bq.outerHTML, renderNestedBlockquotes(bq.innerHTML))
      // content = content.replace(bq.outerHTML, `<blockquote>${bq.innerHTML.replace(/^(&gt;)+/g, '')}</blockquote>`)
    })

    content = content.replace(/\t/g, '')
    // content = content.replace(/\n/g, '<br>\n')
    content = content.replace(/&amp;/g, '&');
    replacements.forEach(replacement => {
      content = content.replace(replacement.find, replacement.replaceWith)
    })


    const flatViewLink = document.querySelector('a[target="flatview"]') as HTMLAnchorElement
    let threadId = undefined
    if (flatViewLink) {
      const match = flatViewLink.href.match(/thrdid=([\d]+)/)
      if (match !== null) {
        threadId = parseInt(match[1])
      }
    }

    return {
      title,
      author,
      content,
      authorId,
      date,
      threadId
    }

  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500
    })
  }
}