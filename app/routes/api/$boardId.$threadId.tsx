import { LoaderFunction } from 'remix'
import { fetchMessages } from '~/api'

export const loader: LoaderFunction = async (context) => {
  return fetchMessages(context)
}
