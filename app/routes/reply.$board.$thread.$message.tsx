import { ActionFunction, Form, Link, LoaderFunction, useActionData, useLoaderData, useParams } from "remix"
import { useState } from "react"
import { user } from "~/cookies/user"

export const loader: LoaderFunction = async ({ params }) => {
  const response = await fetch(`${process.env.LOCAL_SERVER ?? `http://localhost:3000`}/api/board/${params.board}/thread/${params.thread}/message/${params.message}/plain`)
  const data = await response.json()
  return data
}

export const action: ActionFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get("Cookie")
  const userData = await user.parse(cookieHeader) || undefined

  if (!userData) {
    return {
      error: 'Du musst eingeloggt sein!'
    }
  }

  const formData = await request.formData()
  const postData = [
    `subject=${encodeURIComponent(formData.get('title') as string)}`,
    `body=${encodeURIComponent(formData.get(`body`) as string)}`,
    `mode=messagesave`,
    `brdid=${params.board}`,
    `msgid=${params.message}`,
    `notification=1`
  ]

  const response = await fetch(`https://maniac-forum.de/forum/pxmboard.php`, {
    method: `post`,
    headers: {
      'Content-type': `application/x-www-form-urlencoded`,
      Cookie: userData.cookie
    },
    body: postData.join(`&`)
  })

  const data = await response.text()
  let match = data.match(/Vielen Dank für deinen Beitrag.*pxmboard.php\?mode=message&brdid=(\d+)&msgid=(\d+)/m)
  if (match) {
    return { success: true, msgid: match[2] }
  }
  match = data.match(/fehler (\d+).*\n\s+<td colspan="3" id="norm">(.*)<\/td>/m)
  if (match) {
    return { success: false, code: match[1], message: match[2] }
  }
  return {}
}

export default function Reply() {
  const params = useParams()
  const data = useLoaderData()
  const actionData = useActionData()
  const [wantsToCite, setWantsToCite] = useState<boolean>(false)

  const title = data.title.startsWith(`Re:`) ? data.title : `Re: ${data.title}`
  const body = wantsToCite ? `>` + data.content.trim().replace(/\n/g, "\n>").replace(/&gt;/g, ">") : ``

  return <div className="bg-white text-gray-900 dark:bg-slate-900 dark:text-gray-100 h-full overflow-hidden p-2 lg:px-4 overflow-y-auto">
    <div className="border border-gray-500 dark:border-gray-300 rounded-lg">
      {!actionData || actionData.success === false ?
        <Form method="post">
          <div className="p-2">
            <input type="text" name="title" placeholder="Titel" defaultValue={title} className="w-full border-0 bg-transparent text-xl" maxLength={56} />
            <textarea name="body" placeholder="Deine Nachricht..." defaultValue={body} className="w-full border-0 bg-transparent h-56"></textarea>
          </div>
          <div className="p-2 md:p-4 flex justify-between border-t border-gray-400 dark:border-gray-500">
            <button type="button" className="action-button !bg-gray-300 !text-gray-900" onClick={() => setWantsToCite(!wantsToCite)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>Zitieren</div>
            </button>
            <button type="submit" className="action-button">Abschicken</button>
          </div>
          {actionData && actionData.success === false ?
            <div className="text-red-500 p-2 md:p-4">Fehler {actionData.code}, {actionData.message}</div> : null}
        </Form> :
        <div className="p-2 md:p-4">
          Vielen Dank für deinen Beitrag.
          <Link to={`/board/${params.board}/thread/${params.thread}/message/${actionData.message}`}>Zum Beitrag.</Link>
        </div>
      }
    </div>
  </div>
}