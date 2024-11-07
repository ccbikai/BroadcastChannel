import { getChannelInfo } from '../lib/telegram'

export async function GET(Astro) {
  const request = Astro.request
  const url = new URL(request.url)
  const channel = await getChannelInfo(Astro)
  const posts = channel.posts || []

  const pageSize = 20
  let count = +posts[0]?.id

  const pages = []
  pages.push(count)
  while (count > pageSize) {
    count -= pageSize
    pages.push(count)
  }

  const sitemaps = pages.map((page) => {
    return `
<sitemap>
  <loc>${url.origin}/sitemap/${page}.xml</loc>
</sitemap>`
  })

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.join('')}
</sitemapindex>`, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
