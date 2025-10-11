import { getChannelInfo } from '../lib/telegram'

export async function GET(Astro) {
  const { SITE_URL } = Astro.locals
  const channel = await getChannelInfo(Astro)
  const posts = channel.posts || []

  const pageSize = 20
  let count = Number.parseInt(posts[0]?.id, 10)

  const pages = []
  if (Number.isFinite(count)) {
    pages.push(count)
    while (count > pageSize) {
      count -= pageSize
      pages.push(count)
    }
  }

  const siteUrl = new URL(SITE_URL)

  const sitemaps = pages.map((page) => {
    return `
<sitemap>
  <loc>${new URL(`sitemap/${page}.xml`, siteUrl).toString()}</loc>
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
