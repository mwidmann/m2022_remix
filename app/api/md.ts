import fs from 'fs/promises'
import path from 'path'
import parseFrontMatter from 'front-matter'
import { marked } from 'marked'

export async function getPage(name: string): Promise<{ html: string }> {
  const postsPath = path.join(__dirname, '../..', 'pages')
  const filepath = path.join(postsPath, `${name}.md`)
  const file = await fs.readFile(filepath)
  const { body } = parseFrontMatter(file.toString())
  const html = marked(body)
  return { html }
}
