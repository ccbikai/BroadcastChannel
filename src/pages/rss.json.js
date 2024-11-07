import { getChannelInfo } from '../lib/telegram'

export async function GET(Astro) {
  const request = Astro.request
  const { SITE_URL } = Astro.locals
  const channel = await getChannelInfo(Astro)
  const posts = channel.posts || []

  const url = new URL(request.url)
  url.pathname = SITE_URL

  return Response.json({
    version: 'https://jsonfeed.org/version/1.1',
    title: channel.title,
    description: channel.description,
    home_page_url: url.toString(),
    items: posts.map(item => ({
      url: `${url.toString()}posts/${item.id}`,
      title: item.title,
      description: item.description,
      date_published: new Date(item.datetime),
      tags: item.tags,
      content_html: item.content,
    })),
  })
}
