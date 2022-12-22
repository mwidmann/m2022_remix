export default function UserProfile({
  userProfile,
}: {
  userProfile: { [key: string]: string }
}) {
  const userId = parseInt(userProfile['Account-Nr.'] ?? '', 10)
  return (
    <div>
      <div className="z-10 flex items-center justify-center">
        <img
          className="h-28 w-28 rounded-full object-cover ring-2 ring-gray-500 dark:ring-gray-300"
          src={`https://maniac-forum.de/forum/images/profile/${
            userId - (userId % 100)
          }/${userId}.jpg`}
        />
      </div>
      <div className="-mt-8 grid grid-cols-2 overflow-hidden rounded-lg px-2 pt-10 ring-2 ring-gray-500 dark:ring-gray-300 md:px-4">
        {/* <pre>{JSON.stringify(userProfile, null, 2)}</pre> */}
        {Object.keys(userProfile).map((k) => (
          <>
            <div>{k}</div>
            <div>{userProfile[k]}</div>
          </>
        ))}
      </div>
      {/* {currentUser.username} */}
    </div>
  )
}
