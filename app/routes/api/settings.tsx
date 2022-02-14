import { ActionFunction, json } from 'remix'
import { user } from '~/cookies/user'
import { settings } from '~/cookies/settings'

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const cookieHeader = request.headers.get('Cookie')
  const settingsCookie = (await settings.parse(cookieHeader)) || {}

  switch (form.get(`_action`)) {
    case 'login':
      const formData = [
        `nick=${encodeURIComponent(form.get('nick') as string)}`,
        `pass=${encodeURIComponent(form.get('pass') as string)}`,
        `mode=login`,
        `brdid=`,
      ]

      const response = await fetch(
        `https://maniac-forum.de/forum/pxmboard.php`,
        {
          method: 'post',
          headers: { 'Content-type': `application/x-www-form-urlencoded` },
          body: formData.join(`&`),
        }
      )
      const headers = response.headers
      const data = await response.text()

      const match = data.match(
        /<div>id: (\d+)<\/div>\s+<div>nickname: (.*)<\/div>/m
      )
      if (match) {
        const userid = match[1]
        const username = match[2]
        const cookie = headers.get('set-cookie')

        const currentUser = { userid, username, cookie }
        return json(currentUser, {
          headers: {
            'Set-Cookie': await user.serialize(
              { userid, username, cookie },
              { path: '/' }
            ),
          },
        })
      } else {
        const match = data.match(/fehler \d+: (.*)<\/td>/m)
        return { error: match ? match[1] : `Unbekannter Fehler beim Login` }
      }
    case 'logout':
      const cookie = await user.serialize(``, {
        expires: new Date(1970, 1, 1),
        path: '/',
      })
      return json(
        {},
        {
          headers: {
            'Set-Cookie': cookie,
          },
        }
      )
    case 'toggleSetting':
      const settingName = form.get(`setting`) as string
      settingsCookie[settingName] = form.get(`_value`)
      return json(settingsCookie, {
        headers: {
          'Set-Cookie': await settings.serialize(settingsCookie, { path: '/' }),
        },
      })
  }
  return null
}
