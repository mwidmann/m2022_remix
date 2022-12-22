import { Form, Link, useParams } from "@remix-run/react";
import { Switch } from '@headlessui/react'

import { useState } from 'react'

export default function PostMessage({
  actionData,
  data,
  mode,
}: {
  actionData: any
  data: any
  mode: 'edit' | 'reply' | 'new'
}) {
  const params = useParams()
  const [wantsToCite, setWantsToCite] = useState<boolean>(false)
  const [notifyByMail, setNotifyByMail] = useState<boolean>(false)

  let title = ''
  let body = ''
  if (mode === 'edit') {
    title = data.title
    body = data.content
  } else if (mode === 'reply') {
    title = data.title.startsWith(`Re:`) ? data.title : `Re: ${data.title}`
    body = wantsToCite
      ? `>` + data.content.trim().replace(/\n/g, '\n>').replace(/&gt;/g, '>')
      : ``
  }

  return (
    <div className="h-full rounded-lg border border-gray-500 dark:border-gray-300">
      {!actionData || actionData.success === false ? (
        <Form method="post" className="flex h-full min-h-[50vh] flex-col py-2">
          <div className="shrink-0 grow-0">
            <input
              type="text"
              name="title"
              placeholder="Titel"
              defaultValue={title}
              className=" w-full border-0 bg-transparent text-xl"
              maxLength={56}
            />
          </div>
          <div className="relative h-full grow">
            <textarea
              name="body"
              placeholder="Deine Nachricht..."
              defaultValue={body}
              className="absolute h-full w-full border-0 bg-transparent"
            ></textarea>
          </div>
          <div className="flex shrink grow-0 justify-between border-t border-gray-400 p-2 dark:border-gray-500 md:p-4">
            <div>
              {mode === 'reply' ? (
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
              ) : null}
            </div>
            <div className="flex items-center justify-end space-x-2">
              {notifyByMail ? (
                <input type="hidden" name="notification" value="1" />
              ) : null}
              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label
                    className={
                      notifyByMail
                        ? `text-gray-400 neon:text-neonf-100 neon:drop-shadow-neon-md`
                        : `text-gray-700 neon:text-neonf-900`
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
                      notifyByMail
                        ? 'bg-blue-600 neon:bg-neonf-300 neon:drop-shadow-neon-md neon:focus:ring-neonf-100'
                        : 'bg-gray-200 neon:bg-neonb-500'
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
          {mode === 'reply' ? (
            <p>Vielen Dank für deinen Beitrag.</p>
          ) : mode === 'edit' ? (
            <p>Vielen Dank für das Ändern deines Beitrags.</p>
          ) : (
            <p>Vielen Dank für deinen Beitrag.</p>
          )}
          <Link
            to={`/board/${params.boardId}/thread/${params.threadId}/message/${actionData?.msgid}`}
            className="font-bold"
          >
            Zum Beitrag &raquo;
          </Link>
        </div>
      )}
    </div>
  )
}
