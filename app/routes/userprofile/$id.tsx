import { LoaderFunction, useLoaderData } from "remix"
import UserProfile from "~/components/UserProfile"
import * as cheerio from 'cheerio'
import { fetchUserProfile } from '~/api'

export const loader: LoaderFunction = async (args) => {
  return await fetchUserProfile(args)
}

export default function UserProfilePage() {
  const userData = useLoaderData()
  return (
    <div className="bg-white text-gray-900 dark:bg-slate-900 dark:text-gray-100 h-full overflow-hidden p-2 lg:px-4 overflow-y-auto">
      <UserProfile userProfile={userData} />
    </div>
  )
}