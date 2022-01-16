import { JSDOM } from "jsdom"

export async function loader({ params }: { params: { id: number } }) {
  const id = params.id
  try {
    const response = await fetch(`https://maniac-forum.de/forum/pxmboard.php?mode=userprofile&brdid=&usrid=${id}`)
    const data = await response.text()
    const document = new JSDOM(data).window.document

    const userProfile = Array.from(document.querySelectorAll(`tr.bg2`)).reduce((acc, e) => {
      const key = e.querySelector(`td:nth-child(1)`)?.textContent || ''
      const val = e.querySelector(`td:nth-child(2)`)?.textContent?.trim() || ''
      acc[key] = val
      return acc
    }, {} as { [key: string]: string })
    return userProfile
  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500
    })
  }
}