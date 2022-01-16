export default function ThreadCount({ hasNewMessages, count }: { hasNewMessages: boolean, count: number }) {
  return (
    <div className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${hasNewMessages ? `bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200` : `bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100`}`}>
      {count}
    </div>
  )
}