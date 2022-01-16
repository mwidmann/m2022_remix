import { UserData } from "~/types";

export default function UserProfile({ userProfile }: { userProfile: { [key: string]: string } }) {
  const userId = parseInt(userProfile['Account-Nr.'] ?? '', 10)
  return (
    <div>
      <div className="flex items-center justify-center z-10">
        <img className="rounded-full ring-2 ring-gray-500 dark:ring-gray-300 w-28 h-28 object-cover" src={`https://maniac-forum.de/forum/images/profile/${userId - userId % 100}/${userId}.jpg`} />
      </div>
      <div className="grid grid-cols-2 -mt-8 ring-2 ring-gray-500 dark:ring-gray-300 pt-10 rounded-lg px-2 md:px-4 overflow-hidden">
        {/* <pre>{JSON.stringify(userProfile, null, 2)}</pre> */}
        {Object.keys(userProfile).map(k => (
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