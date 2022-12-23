import { type LoaderFunction } from '@remix-run/node'
import { fetchMessages } from '~/api'

export const loader: LoaderFunction = async (context) => {
  return fetchMessages(context)
}
