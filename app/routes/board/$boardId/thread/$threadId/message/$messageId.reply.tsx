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
import { Switch } from '@headlessui/react'

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

  console.log(data)

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
  const params = useParams()
  const data = useLoaderData()
  const actionData = useActionData()
  const [wantsToCite, setWantsToCite] = useState<boolean>(false)
  const [notifyByMail, setNotifyByMail] = useState<boolean>(false)
  console.log(actionData)

  const title = data.title.startsWith(`Re:`) ? data.title : `Re: ${data.title}`
  const body = wantsToCite
    ? `>` + data.content.trim().replace(/\n/g, '\n>').replace(/&gt;/g, '>')
    : ``

  return (
    <div className="h-full overflow-hidden p-2 text-gray-900 dark:text-gray-100 lg:px-4">
      <div className="h-full rounded-lg border border-gray-500 dark:border-gray-300">
        {!actionData || actionData.success === false ? (
          <Form method="post" className="flex h-full max-h-96 flex-col py-2">
            <div className="shrink-0">
              <input
                type="text"
                name="title"
                placeholder="Titel"
                defaultValue={title}
                className="w-full border-0 bg-transparent text-xl"
                maxLength={56}
              />
            </div>
            <div className="grow-1 h-full">
              <textarea
                name="body"
                placeholder="Deine Nachricht..."
                defaultValue={body}
                className="h-full max-h-64 w-full border-0 bg-transparent"
              ></textarea>
            </div>
            <div className="flex justify-between border-t border-gray-400 p-2 dark:border-gray-500 md:p-4">
              <button
                type="button"
                className="action-button !bg-gray-300 !text-gray-900"
                onClick={() => setWantsToCite(!wantsToCite)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>Zitieren</div>
              </button>
              <div className="flex items-center justify-end space-x-2">
                {/*
              <button type="button" className={`action-button !bg-gray-300 ${notifyByMail === 1 ? `!text-gray-900` : `!text-gray-400`}`} onClick={() => setNotifyByMail(notifyByMail === 1 ? 0 : 1)}>
                <svg width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
              </button> */}

                {notifyByMail ? (
                  <input type="hidden" name="notification" value="1" />
                ) : null}
                <Switch.Group>
                  <div className="flex items-center justify-between">
                    <Switch.Label
                      className={
                        notifyByMail ? `text-gray-400` : `text-gray-700`
                      }
                    >
                      <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24">
                        <g fill="none">
                          <path
                            d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </g>
                      </svg>
                    </Switch.Label>
                    <Switch
                      name="notification"
                      type="submit"
                      checked={notifyByMail}
                      onChange={setNotifyByMail}
                      className={`${
                        notifyByMail ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          notifyByMail ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                </Switch.Group>

                <button type="submit" className="action-button">
                  Abschicken
                </button>
              </div>
            </div>
            {actionData && actionData.success === false ? (
              <div className="p-2 text-red-500 md:p-4">
                Fehler {actionData.code}, {actionData.message}
              </div>
            ) : null}
          </Form>
        ) : (
          <div className="overflow-auto p-2 md:p-4">
            <pre>{JSON.stringify(actionData)}</pre>
            Vielen Dank für deinen Beitrag.
            <Link
              to={`/board/${params.boardId}/thread/${params.threadId}/message/${actionData.msgid}`}
            >
              Zum Beitrag.
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
