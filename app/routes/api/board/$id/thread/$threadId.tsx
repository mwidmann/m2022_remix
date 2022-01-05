import { JSDOM } from "jsdom"
import { Message } from '~/types'

const getParents = (elem: Element, document: Document) => {

  // Set up a parent array
  var parents = [];

  // Push each parent element to the array
  for (; elem && elem.tagName !== 'BODY'; elem = elem.parentNode as Element) {
    parents.push(elem.tagName);
  }

  // Return our parent array
  return parents;
};

export async function loader({ params }: { params: { id: number, threadId: number } }) {
  try {
    const { id, threadId } = params
    const threadResponse = await fetch(`https://maniac-forum.de/forum/pxmboard.php?mode=thread&brdid=${id}&thrdid=${threadId}`)
    const threadContent = await threadResponse.text()
    const document = new JSDOM(threadContent).window.document

    const messages: Message[] = []

    Array.from(document.querySelectorAll('li')).forEach((li: Element, index) => {
      const title = li.querySelector('a > font')?.textContent ?? ''
      const hierarchy = getParents(li, document).filter((e) => e === 'UL').length
      const author = li.querySelector('span span')?.textContent?.trim() ?? ''
      const name = li.querySelector('a')?.getAttribute('name') ?? ''
      const id = parseInt(name.replace('p', ''))

      li.querySelector(`li > span > font > b`)?.remove()
      const foundDate = li.querySelector(`li > span > font`)?.textContent ?? ''
      const date = foundDate.replace(' - ', '')
      messages.push({
        title,
        hierarchy,
        author,
        id,
        date
      })
    })

    return messages;

  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500
    })
  }
}