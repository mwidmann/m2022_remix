export default function ThreadCount({
  hasNewMessages,
  count,
}: {
  hasNewMessages: boolean
  count: number
}) {
  return (
    <div
      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
        hasNewMessages
          ? `bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200`
          : `bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100`
      }`}
    >
      {count}
    </div>
  )
}
