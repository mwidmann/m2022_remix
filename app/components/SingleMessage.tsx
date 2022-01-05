import { Link } from "remix";
import { Message } from "~/types";

export default function SingleMessage({ message }: { message: Message }) {
  const indentation = {
    marginLeft: `${message.hierarchy / 2}rem`,
  }
  return (
    <div className={`pr-2 py-1 border-b border-b-gray-800`}>
      <Link to={`message/${message.id}`} >
        <div style={indentation}>
          <p className="text-sm font-semibold overflow-hidden whitespace-nowrap text-ellipsis">{message.title}</p>
          <p className="text-xs text-gray-700"><b>{message.author}</b> - {message.date}</p>
        </div>
      </Link>
    </div>
  )
}