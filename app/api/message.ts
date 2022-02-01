import * as cheerio from 'cheerio'
import type { LoaderFunction } from 'remix'
import { Message, PlainMessage } from '~/types'

type MessageInfo = {
  brdid?: number
  thrdid?: number
  msgid?: number
}
const extractMessageInfo = (str: string): MessageInfo => {
  const regex = /(brdid|msgid|thrdid)=(\d*)/gm
  let m
  let r = {
    brdid: 0,
    thrdid: 0,
    msgid: 0,
  }
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    r[m[1] as keyof MessageInfo] = parseInt(m[2] as string)
  }
  return r
}

const renderNestedBlockquotes = (str: string): string => {
  const lines = str.split(`\n`)
  let nestingLevel = 0
  let nestedBlockquotes = ``

  lines.forEach((line) => {
    let match = line.match(/^(&gt;)*/)
    if (match !== null) {
      const currentNestingLevel = match[0].length / 4
      if (currentNestingLevel > nestingLevel) {
        for (let i = nestingLevel; i < currentNestingLevel; i++) {
          nestedBlockquotes += `<div class="blockquote">`
        }
        nestingLevel = currentNestingLevel
      }

      nestedBlockquotes += line.replace(match[0], '')

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

  return nestedBlockquotes
}

export const fetchMessage: LoaderFunction = async ({
  params,
}): Promise<Message | Response> => {
  try {
    console.time(`message:content`)
    const { boardId, messageId } = params
    const messageResponse = await fetch(
      `https://maniac-forum.de/forum/pxmboard.php?mode=message&brdid=${boardId}&msgid=${messageId}`
    )
    const messageContent = await messageResponse.text()
    console.timeEnd(`message:content`)

    console.time('message:cheerio')
    const $ = cheerio.load(messageContent)
    let $contentEl = $(`.bg2 > td > font`)
    let replacements: { find: string; replaceWith: string }[] = []

    $contentEl.find(`a`).each((_, a) => {
      const $a = $(a)
      const href = $a.attr('href') ?? ''

      // internal link
      let match = href.match(/pxmboard.php\?mode=message/)
      if (match !== null) {
        match = href.match(/(brdid|msgid|thrdid)=(\d*)/)
        try {
          const { brdid, thrdid, msgid } = extractMessageInfo(href)
          $a.attr('href', `/board/${brdid}/thread/${thrdid}/message/${msgid}`)
        } catch (e) {
          // do nothing....
        }
      }

      // youtube video
      match = href.match(
        /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
      )
      if (match !== null) {
        const youtubeIframe = `<iframe src="https://youtube.com/embed/${match[1]}" allowfullscreen class="w-full aspect-video"></iframe>`
        replacements.push({
          find: '[' + $a.prop(`outerHTML`) + ']',
          replaceWith: '[' + $a.prop(`outerHTML`) + ']<br><br>' + youtubeIframe,
        })
      }

      // images
      match = href.match(/.jpe?g|.gif|.png$/)
      if (match !== null) {
        const img = `<img src="${href}" class="w-full h-auto"/>`
        replacements.push({
          find: '[' + $a.prop(`outerHTML`) + ']',
          replaceWith: '[' + $a.prop(`outerHTML`) + ']<br><br>' + img,
        })
      }
    })

    const title = $(`table > tbody > tr > td > table > tbody > tr > td > b`)
      .text()
      .trim()
    const $el = $(`table > tbody > tr:nth-child(2) > td#norm > a`)
    const author = $el.text().trim()
    const href = $el.attr('href') ?? ''
    const authorId = parseInt(href.replace(/.*usrid=/, '') ?? '0')
    const date = $(`table > tbody > tr:nth-child(3) > td#norm:nth-child(2)`)
      .text()
      .trim()

    let content = $contentEl.html() ?? ''

    $contentEl.find(`font[color='808080']`).each((_, bq) => {
      const $bq = $(bq)
      content = content.replace(
        $bq.prop(`outerHTML`) ?? '',
        renderNestedBlockquotes($bq.html() ?? '')
      )
    })

    content = content.replace(/\t/g, '')
    // content = content.replace(/\n/g, '<br>\n')
    content = content.replace(/&amp;/g, '&')
    replacements.forEach((replacement) => {
      content = content.replace(replacement.find, replacement.replaceWith)
    })

    const flatViewLink = $('a[target="flatview"]')
    let threadId = undefined
    if (flatViewLink.length === 1) {
      const match = (flatViewLink.attr('href') ?? '').match(/thrdid=([\d]+)/)
      if (match !== null) {
        threadId = parseInt(match[1])
      }
    }

    console.timeEnd('message:cheerio')
    return {
      title,
      author,
      content,
      authorId,
      date,
      threadId,
    }
  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500,
    })
  }
}

export const fetchMessagePlain: LoaderFunction = async ({
  params,
}): Promise<PlainMessage | Response> => {
  try {
    console.time('plainmessage:content')
    const { boardId, messageId } = params
    const messageResponse = await fetch(
      `https://maniac-forum.de/forum/pxmboard.php?mode=message&brdid=${boardId}&msgid=${messageId}`
    )
    const messageContent = await messageResponse.text()
    console.timeEnd('plainmessage:content')

    console.time('plainmessage:cheerio')
    const $ = cheerio.load(messageContent)
    const title = $(`table > tbody > tr > td > table > tbody > tr > td > b`)
      .text()
      .trim()
    const content = $(`.bg2 > td > font`).text().trim()

    console.timeEnd('plainmessage:cheerio')

    return {
      title,
      content,
    }
  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500,
    })
  }
}
