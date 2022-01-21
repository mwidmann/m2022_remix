import { ErrorBoundaryComponent, Link, LoaderFunction } from "remix"
import { useLoaderData, useParams, useNavigate } from "remix"
import { Message } from "~/types"
import { useEffect, useRef } from "react"
import { fetchMessage } from "~/api"

export const loader: LoaderFunction = async (context): Promise<Message | Response> => {
  return await fetchMessage(context)
}

export default function MessageDetail() {
  const message: Message = useLoaderData()
  const navigate = useNavigate()
  const params = useParams()
  const messageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log(`should scroll to top on `, messageRef)
    messageRef.current?.parentElement?.scrollTo(0, 0)
  }, [params.messageId])

  useEffect(() => {
    if (parseInt(params.threadId ?? '0') === 0) {
      navigate(`../../thread/${message.threadId}/message/${params.messageId}`)
    }
  }, [params.threadId])

  useEffect(() => {
    const spoiler = (e: Event) => {
      const spoiler = (e.target as HTMLButtonElement).nextElementSibling as HTMLSpanElement
      if (spoiler) {
        spoiler.style.display = spoiler.style.display === 'none' ? 'inline' : 'none'
      }

    }

    const spoilerList: HTMLButtonElement[] = []
    Array.from(document.querySelectorAll(`.spoiler_btn`)).forEach(s => {
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
        spoilerList.forEach(b => {
          b.removeEventListener(`click`, spoiler)
        })
      }
    })
  }, [])

  const authorId = message.authorId
  return (
    <div className="p-2 pb-10 w-full overflow-x-hidden md:max-w-xl lg:max-w-none lg:w-full" ref={messageRef}>
      <div className="flex justify-between items-center w-full bg-slate-100 dark:bg-slate-700 p-2 shadow rounded">
        <Link to={`/userprofile/${authorId}`} className="flex items-center space-x-2 no-underline text-gray-900 dark:text-gray-100">
          <img className="overflow-hidden bg-gray-500 rounded-full ring-2 ring-gray-500 dark:ring-gray-300 w-8 h-8 object-cover" src={`https://maniac-forum.de/forum/images/profile/${authorId - authorId % 100}/${authorId}.jpg`} />
          <div>
            <div className="font-medium">{message.author}</div>
            <div className="text-xs">{message.date}</div>
          </div>
        </Link>
        <div>
          <button className="action-button" onClick={() => navigate(`reply`)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <div>Antworten</div>
          </button>
        </div>
      </div>
      <div className="prose prose-sm md:prose-base dark:prose-invert mt-4">
        <h3 className="font-semibold">{message.title}</h3>
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: message.content }} />
      </div>
    </div >
  )
}
