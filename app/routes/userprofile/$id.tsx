import { useLoaderData } from '@remix-run/react'
import { LoaderFunction } from '@remix-run/node'
import UserProfile from '~/components/UserProfile'
import * as cheerio from 'cheerio'
import { fetchUserProfile } from '~/api'

type LoaderData = { [key: string]: string } | null;

export const loader: LoaderFunction = async (args): Promise<LoaderData> => {
  const result = await fetchUserProfile(args)
  return result || {}
}

export default function UserProfilePage() {
  const userData = useLoaderData<LoaderData>()
  return (
    <div className="h-full overflow-hidden overflow-y-auto p-2 lg:px-4">
      <UserProfile userProfile={userData || {}} />
    </div>
  )
}
