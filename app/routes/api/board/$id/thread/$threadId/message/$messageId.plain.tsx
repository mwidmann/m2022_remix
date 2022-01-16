import { JSDOM } from "jsdom"

export async function loader({ params }: { params: { id: number, threadId: number, messageId: number } }): Promise<Message | Response> {
  try {
    const { id, messageId } = params
    const messageResponse = await fetch(`https://maniac-forum.de/forum/pxmboard.php?mode=message&brdid=${id}&msgid=${messageId}`)
    const messageContent = await messageResponse.text()
    const document = new JSDOM(messageContent).window.document

    const title = document.querySelector('table > tbody > tr > td > table > tbody > tr > td > b')?.textContent?.trim() ?? ''
    let content = document.querySelector('.bg2 > td > font')?.textContent ?? ''

    return {
      title,
      content,
    }

  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500
    })
  }
}