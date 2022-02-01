import { LoaderFunction, useLoaderData } from 'remix'
import { getPage } from '~/api'

export const loader: LoaderFunction = async () => {
  return await getPage('about')
}

export default function AboutPage() {
  const { html } = useLoaderData()

  return (
    <div className="h-full overflow-y-auto">
      <div className="prose mx-auto max-w-lg p-2 pb-10 neon:prose-neon dark:prose-invert md:p-4">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}
