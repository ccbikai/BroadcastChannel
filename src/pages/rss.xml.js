import rss from '@astrojs/rss'

import { getChannelInfo } from '../lib/telegram'

export const prerender = false

export async function GET(Astro) {
  const request = Astro.request
  const { SITE_URL } = Astro.locals
  const channel = await getChannelInfo(Astro)
  const posts = channel.posts || []

  const url = new URL(request.url)
  url.pathname = SITE_URL

  return rss({
    title: channel.title,
    description: channel.description,
    site: url.origin,
    items: posts.map(item => ({
      link: `posts/${item.id}`,
      title: item.title,
      description: item.description,
      pubDate: new Date(item.datetime),
      content: item.content,
    })),
  })
}
