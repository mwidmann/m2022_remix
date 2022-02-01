import AboutContent from '~/pages/about.md'

export default function AboutPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="prose mx-auto max-w-lg p-2 pb-10 neon:prose-neon dark:prose-invert md:p-4">
        <AboutContent />
      </div>
    </div>
  )
}
