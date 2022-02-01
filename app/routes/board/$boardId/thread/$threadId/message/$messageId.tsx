import { Link, LoaderFunction, useMatches } from 'remix'
import { useLoaderData, useParams, useNavigate } from 'remix'
import { Message, Thread, ThreadMessage } from '~/types'
import { useEffect, useRef, useContext, useState } from 'react'
import { fetchMessage } from '~/api'
import { AppContext } from '~/context/AppContext'

export const loader: LoaderFunction = async (
  context
): Promise<Message | Response> => {
  return await fetchMessage(context)
}

export default function MessageDetail() {
  const message: Message = useLoaderData()
  const navigate = useNavigate()
  const params = useParams()
  const matches = useMatches()
  const { currentUser } = useContext(AppContext)
  const messageRef = useRef<HTMLDivElement>(null)
  const [canEdit, setCanEdit] = useState<boolean>(false)

  const threadId = parseInt(params.threadId ?? '0')
  console.log(`threadId im message`, threadId)

  const findMessageInThread = (m: ThreadMessage): ThreadMessage | undefined => {
    if (m.id === parseInt(params.messageId ?? '0')) {
      return m
    }
    let result
    if (m.children) {
      for (let i = 0; i < m.children.length; i++) {
        result = findMessageInThread(m.children[i])
        if (result) {
          return result
        }
      }
    }
    return result
  }

  useEffect(() => {
    messageRef.current?.parentElement?.scrollTo(0, 0)
    setCanEdit(false)
    if (
      !isNaN(threadId) &&
      threadId !== 0 &&
      currentUser &&
      currentUser.userid &&
      message.authorId === currentUser.userid
    ) {
      const threadMatch = matches.find(
        (m) => m.id === 'routes/board/$boardId/thread/$threadId'
      )
      if (threadMatch && threadMatch.data) {
        const m = findMessageInThread(threadMatch.data.thread as ThreadMessage)
        if (m?.children.length === 0) {
          setCanEdit(true)
        }
      }
    }
  }, [params.messageId])

  useEffect(() => {
    if (isNaN(threadId) || threadId === 0) {
      navigate(`../../thread/${message.threadId}/message/${params.messageId}`)
    }
  }, [params.threadId])

  useEffect(() => {
    const spoiler = (e: Event) => {
      const spoiler = (e.target as HTMLButtonElement)
        .nextElementSibling as HTMLSpanElement
      if (spoiler) {
        spoiler.style.display =
          spoiler.style.display === 'none' ? 'inline' : 'none'
      }
    }

    const spoilerList: HTMLButtonElement[] = []
    Array.from(document.querySelectorAll(`.spoiler_btn`)).forEach((s) => {
      const newSpoilerButton = document.createElement(`button`)
      newSpoilerButton.classList.add(`spoiler-button`)
      newSpoilerButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="pointer-events-none">Spoiler</div>
      `
      s.parentNode?.replaceChild(newSpoilerButton, s)
      newSpoilerButton.addEventListener(`click`, spoiler)
      spoilerList.push(newSpoilerButton)

      return () => {
        spoilerList.forEach((b) => {
          b.removeEventListener(`click`, spoiler)
        })
      }
    })
  }, [])

  const authorId = message.authorId
  return (
    <div
      className="w-full overflow-x-hidden p-2 pb-10 md:max-w-xl lg:w-full lg:max-w-none"
      ref={messageRef}
    >
      <div className="flex w-full items-center justify-between rounded bg-slate-100 p-2 shadow neon:bg-neonb-500 dark:bg-slate-500">
        <Link
          to={`/userprofile/${authorId}`}
          className="flex items-center space-x-2 text-gray-900 no-underline neon:text-neonf-100 dark:text-gray-100"
        >
          <img
            className="h-8 w-8 overflow-hidden rounded-full bg-gray-500 object-cover ring-2 ring-gray-500 neon:animate-glow-md neon:ring-neonf-300 dark:ring-gray-300"
            src={`https://maniac-forum.de/forum/images/profile/${
              authorId - (authorId % 100)
            }/${authorId}.jpg`}
          />
          <div>
            <div className="font-medium">{message.author}</div>
            <div className="text-xs">{message.date}</div>
          </div>
        </Link>
        <div className="flex items-center gap-x-2">
          {canEdit ? (
            <button className="action-button" onClick={() => navigate(`edit`)}>
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <div className="hidden md:block">Editieren</div>
            </button>
          ) : null}
          <button className="action-button" onClick={() => navigate(`reply`)}>
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
                strokeWidth="2"
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            <div className="hidden md:block">Antworten</div>
          </button>
        </div>
      </div>
      <div className="prose prose-sm mt-4 neon:prose-teal neon:prose-neon dark:prose-invert md:prose-base">
        <h3 className="font-semibold">{message.title}</h3>
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
      </div>
    </div>
  )
}
