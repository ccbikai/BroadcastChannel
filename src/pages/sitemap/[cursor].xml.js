import { getChannelInfo } from '../../lib/telegram'

export async function GET(Astro) {
  const request = Astro.request
  const url = new URL(request.url)
  const channel = await getChannelInfo(Astro, {
    before: Astro.params.cursor,
  })
  const posts = channel.posts || []

  const xmlUrls = posts.map(post => `
    <url>
      <loc>${url.origin}/posts/${post.id}</loc>
      <lastmod>${new Date(post.datetime).toISOString()}</lastmod>
    </url>
  `).join('')

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${xmlUrls}
</urlset>`, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
