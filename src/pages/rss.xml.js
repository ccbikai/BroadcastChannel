import { getRssString } from '@astrojs/rss'
import sanitizeHtml from 'sanitize-html'
import { getChannelInfo } from '../lib/telegram'
import { getEnv } from '../lib/env'
import style from '../assets/rss.xsl?raw'

export async function GET(Astro) {
  const { SITE_URL } = Astro.locals
  const tag = Astro.url.searchParams.get('tag')
  const channel = await getChannelInfo(Astro, {
    q: tag ? `#${tag}` : '',
  })
  const posts = channel.posts || []

  const request = Astro.request
  const url = new URL(request.url)
  url.pathname = SITE_URL
  url.search = ''

  let rssString = await getRssString({
    title: `${tag ? `${tag} | ` : ''}${channel.title}`,
    description: channel.description,
    site: url.origin,
    trailingSlash: false,
    items: posts.map(item => ({
      link: `posts/${item.id}`,
      title: item.title,
      description: item.description,
      pubDate: new Date(item.datetime),
      content: sanitizeHtml(item.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'video', 'audio']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          video: ['src', 'width', 'height', 'poster'],
          audio: ['src', 'controls'],
          img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'class'],
        },
        exclusiveFilter(frame) {
          return frame.tag === 'img' && frame.attribs?.class?.includes('modal-img')
        },
      }),
    })),
  })

  const enableBeautify = getEnv(import.meta.env, Astro, 'RSS_BEAUTIFY')
  if (enableBeautify) {
    rssString = rssString.replace(/^(<\?xml .*\?>)/i, style)
  }

  return new Response(rssString, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
