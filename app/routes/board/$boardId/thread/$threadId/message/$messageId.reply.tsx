import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  useActionData,
  useLoaderData,
  useParams,
} from 'remix'
import { useState } from 'react'
import { user } from '~/cookies/user'
import { fetchMessagePlain } from '~/api'
import PostMessage from '~/components/PostMessage'

export const loader: LoaderFunction = async (context) => {
  return await fetchMessagePlain(context)
}

export const action: ActionFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get('Cookie')
  const userData = (await user.parse(cookieHeader)) || undefined

  if (!userData) {
    return {
      error: 'Du musst eingeloggt sein!',
    }
  }

  const formData = await request.formData()
  const postData = [
    `subject=${encodeURIComponent(formData.get('title') as string)}`,
    `body=${encodeURIComponent((formData.get(`body`) as string) ?? '')}`,
    `mode=messagesave`,
    `brdid=${params.boardId}`,
    `msgid=${params.messageId}`,
  ]

  if (formData.has('notification') && formData.get('notification') === '1') {
    postData.push(`notification=1`)
  }

  const response = await fetch(`https://maniac-forum.de/forum/pxmboard.php`, {
    method: `post`,
    headers: {
      'Content-type': `application/x-www-form-urlencoded`,
      Cookie: userData.cookie,
    },
    body: postData.join(`&`),
  })

  const data = await response.text()
  let match = data.match(
    /Vielen Dank für deinen Beitrag.*pxmboard.php\?mode=message&brdid=(\d+)&msgid=(\d+)/m
  )
  if (match) {
    return { success: true, msgid: match[2] }
  }
  match = data.match(/fehler (\d+).*\n\s+<td colspan="3" id="norm">(.*)<\/td>/m)
  if (match) {
    return { success: false, code: match[1], message: match[2] }
  }
  match = data.match(/DBErrorID/)
  if (match) {
    return {
      success: false,
      code: `KHADD!`,
      message: `Fehler beim Speichern der Daten in der DB. Emojies verwendet? 😭`,
    }
  }

  return {}
}

export default function Reply() {
  const data = useLoaderData()
  const actionData = useActionData()

  return (
    <div className="h-full overflow-hidden p-2 text-gray-900 neon:text-neonf-100 dark:text-gray-100 lg:px-4">
      <PostMessage actionData={actionData} data={data} mode="reply" />
    </div>
  )
}
