import * as cheerio from 'cheerio'
import { LoaderFunction } from 'remix'
import { UserProfile } from '~/types'

export const fetchUserProfileById = async (id: string): Promise<UserProfile | Response> => {
  try {
    console.time(`content`)
    const response = await fetch(`https://maniac-forum.de/forum/pxmboard.php?mode=userprofile&brdid=&usrid=${id}`)
    const data = await response.text()
    console.timeEnd(`content`)

    console.time(`cheerio`)
    const $ = cheerio.load(data)
    const userProfile: { [key: string]: string } = {}
    $(`tr.bg2`).each((_, e) => {
      const $e = $(e)
      const td = $e.find(`td`)
      const key = $(td[0]).text().trim() ?? ''
      const val = $(td[1]).text().trim() ?? ''
      if (key !== '') {
        userProfile[key] = val
      }
    })

    console.timeEnd(`cheerio`)
    return userProfile
  } catch (e: any) {
    return new Response(`Error fetching content ` + e.message, {
      status: 500
    })
  }
}

export const fetchUserProfile: LoaderFunction = async ({ params }): Promise<UserProfile | Response> => {
  const id = params.id ?? ''
  return await fetchUserProfileById(id)

}