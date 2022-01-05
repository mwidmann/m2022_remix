import { Link } from "remix";
import { Thread } from "~/types";

export default function SingleThread({ thread }: { thread: Thread }) {
  return (
    <li className="border-b border-gray-700">
      <Link to={`thread/${thread.id}`} className="flex items-center justify-between p-2 w-full text-left">
        <div className="w-full">
          <p className="text-gray-900 text-sm font-semibold">{thread.title}</p>
          <div className="flex justify-between text-xs text-gray-600 w-full mt-1">
            <div><b>{thread.author}</b> am {thread.date}</div>
            <div className="text-red-500">{thread.messages}</div>
          </div>
        </div>
      </Link>
    </li>
  )
}