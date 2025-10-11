import rss from '@astrojs/rss'
import sanitizeHtml from 'sanitize-html'
import { getChannelInfo } from '../lib/telegram'

export async function GET(Astro) {
  const { SITE_URL } = Astro.locals
  const channel = await getChannelInfo(Astro)
  const posts = (channel.posts || []).filter(post => post?.id)
  const siteUrl = new URL(SITE_URL)

  const response = await rss({
    title: channel.title,
    description: channel.description,
    site: siteUrl.toString(),
    trailingSlash: false,
    items: posts.map(item => ({
      link: `posts/${item.id}`,
      title: item.title || channel.title,
      description: sanitizeHtml(item.text ?? '', {
        allowedTags: [],
        allowedAttributes: {},
      }),
      ...(item.datetime ? { pubDate: new Date(item.datetime) } : {}),
    })),
  })

  response.headers.set('Content-Type', 'text/xml')
  response.headers.set('Cache-Control', 'public, max-age=3600')

  return response
}
